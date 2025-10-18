import { Component, computed, effect, ElementRef, input, QueryList, signal, ViewChildren } from '@angular/core';
import { KeyValuePipe, NgClass } from '@angular/common';
import { Match, Sanction, TeamNameMatching, TeamSuspension } from '../app.model';
import { generatePdf } from '../utils';
import moment from 'moment/moment';
import { RemainingMatchesPipe } from '../pipe/remaining-matches.pipe';

@Component({
  selector: 'next-weekend-suspensions',
  imports: [
    KeyValuePipe,
    NgClass,
    RemainingMatchesPipe
  ],
  templateUrl: './next-weekend-suspensions.component.html',
})
export class NextWeekendSuspensionsComponent {
  @ViewChildren('table') tables!: QueryList<ElementRef<HTMLTableElement>>;

  sanctionPerPlayer = input.required<Map<string, Sanction[]>>();
  matches = input.required<Match[]>();
  teamNameMatchings = input<TeamNameMatching[]>([]);
  process = input(false);

  hasProcess = signal(false);

  matchesPerTeam = computed(() =>
    Map.groupBy(this.matches().sort((a, b) => a.dateDuMatch.getTime() - b.dateDuMatch.getTime()),
      match => this.teamNameMatchingPerTeam().get(match.equipeLocale.trim() + match.categorieEquipeLocale.trim()) + " " + match.categorieEquipeLocale)
  );
  competitionToCategory = computed(() => {
    return new Map(this.matches().map(match => [match.competition, match.categorieEquipeLocale]))
  });
  teamNameMatchingPerTeam = computed(() =>
    new Map(this.teamNameMatchings().map(teamNameMatching => [teamNameMatching.nomEquipeFootclub.trim() + teamNameMatching.categorieFootclub.trim(), teamNameMatching.nomEquipeInterne]))
  )

  suspendedPlayersByCategory = signal(new Map<string, Map<string, TeamSuspension[]>>);
  displayResult = computed(() => this.hasProcess() && this.suspendedPlayersByCategory().size !== 0);

  pdfTitle!: string;

  constructor() {
    const today = moment();
    const nextSaturday = today.isoWeekday() <= 6
      ? today.clone().isoWeekday(6)
      : today.clone().add(1, 'week').isoWeekday(6);
    const saturdayDate = nextSaturday.format('DD/MM/YYYY');
    const nextSunday = nextSaturday.add(1, 'day');
    const sundayDate = nextSunday.format('DD/MM/YYYY');
    this.pdfTitle = `Joueurs suspendus – Week-end du ${saturdayDate} au ${sundayDate}`;

    effect(() => {
      if (this.process()) {
        this.sanctionAnalysis();
      } else {
        this.suspendedPlayersByCategory.update(() => new Map());
      }
    });
  }

  sanctionAnalysis() {
    this.hasProcess.set(true);
    const today = new Date()
    today.setHours(0, 0, 0, 0);
    const suspendedPlayersByCategory = new Map<string, Map<string, TeamSuspension[]>>();
    this.sanctionPerPlayer().forEach((sanction, player) => {
      const lastSanction = sanction[sanction.length - 1];
      const sanctionStartDate = lastSanction.dateDeffet ?? today;
      if (sanctionStartDate > today) {
        return;
      }
      const lastNbMatchesSuspension = this.extractSuspensionMatches(lastSanction);
      if (lastNbMatchesSuspension !== 0) {
        const suspensionCategory = this.competitionToCategory().get(lastSanction.competition);
        if (suspensionCategory) {
          const suspendedPlayers = suspendedPlayersByCategory.get(suspensionCategory) ?? new Map<string, TeamSuspension[]>;
          const playerPotentialTeams = new Map([...this.matchesPerTeam().entries()].filter(([key]) => key.includes(suspensionCategory)));
          const suspendedTeams = this.getSuspendedTeams(lastNbMatchesSuspension, playerPotentialTeams, sanctionStartDate, today);
          if (suspendedTeams.length > 0) {
            suspendedPlayers.set(player, suspendedTeams);
          }
          if (suspendedPlayers.size !== 0) {
            suspendedPlayersByCategory.set(suspensionCategory, suspendedPlayers);
          }
        }
      }
    });
    this.suspendedPlayersByCategory.set(new Map(suspendedPlayersByCategory));
  }

  getSuspendedTeams(matchesSuspensionNb: number | string, playerPotentialTeams: Map<string, Match[]>, sanctionStartDate: Date, today: Date) {
    const suspendedTeams: TeamSuspension[] = [];
    playerPotentialTeams.forEach((matches, team) => {
      if (typeof matchesSuspensionNb === 'string') {
        suspendedTeams.push({
          name: team.split(' Libre')[0],
          remaining: 999
        });
      } else {
        const matchesPlayedSinceLastSuspension = matches.filter(match => this.isMatchCountable(match, sanctionStartDate, today)).length;
        if (matchesPlayedSinceLastSuspension < matchesSuspensionNb) {
          suspendedTeams.push({
            name: team.split(' Libre')[0].split(' Foot Entreprise')[0],
            remaining: matchesSuspensionNb - matchesPlayedSinceLastSuspension
          });
        }
      }
    });
    return suspendedTeams.sort((a, b) => a.name.localeCompare(b.name));
  }

  isMatchCountable(match: Match, sanctionStartDate: Date, today: Date) {
    const matchDate = match.dateReport ?? match.dateDuMatch;
    return matchDate >= sanctionStartDate && matchDate < today && !match.competition.includes("Amicaux");
  }

  extractSuspensionMatches(sanction: Sanction): number | string {
    const decision = sanction.libelleDecision;
    const cleanText = decision.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (cleanText.includes('suspendu jusqu\'a reception')) {
      return decision;
    }
    if (sanction.cartonRouge === 'Oui' && cleanText.includes('traite')) {
      return decision;
    }
    const match = cleanText.match(/(\d+)\s+matchs?\s+de\s+suspension/i);
    let count: number = 0;
    if (match) {
      count += parseInt(match[1], 10);
    }
    if (cleanText.includes('automatique')) {
      count++;
    }
    return count;
  }

  protected readonly generatePdf = generatePdf;
}
