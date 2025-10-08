import { Component, computed, effect, ElementRef, input, QueryList, signal, ViewChildren } from '@angular/core';
import { KeyValuePipe, NgClass } from '@angular/common';
import { Match, Sanction, TeamSuspension } from '../app.model';
import { generatePdf } from '../utils';
import moment from 'moment/moment';

@Component({
  selector: 'next-weekend-suspensions',
  imports: [
    KeyValuePipe,
    NgClass
  ],
  templateUrl: './next-weekend-suspensions.component.html',
})
export class NextWeekendSuspensionsComponent {
  @ViewChildren('table') tables!: QueryList<ElementRef<HTMLTableElement>>;

  sanctionPerPlayer = input.required<Map<string, Sanction[]>>();
  matches = input.required<Match[]>();
  process = input(false);

  hasProcess = signal(false);

  matchesPerTeam = computed(() =>
    Map.groupBy(this.matches().sort((a, b) => a.dateDuMatch.getTime() - b.dateDuMatch.getTime()),
      match => match.equipeLocale + " " + match.categorieEquipeLocale)
  );
  competitionToCategory = computed(() => {
    return new Map(this.matches().map(match => [match.competition, match.categorieEquipeLocale]))
  });
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
    const today = new Date();
    const suspendedPlayersByCategory = new Map<string, Map<string, TeamSuspension[]>>();
    this.sanctionPerPlayer().forEach((sanction, player) => {
      const lastSanction = sanction[sanction.length - 1];
      const lastNbMatchesSuspension = this.extractSuspensionMatches(lastSanction.libelleDecision);
      if (lastNbMatchesSuspension !== 0) {
        const suspensionCategory = this.competitionToCategory().get(lastSanction.competition);
        if (suspensionCategory) {
          const suspendedPlayers = suspendedPlayersByCategory.get(suspensionCategory) ?? new Map<string, TeamSuspension[]>;
          const playerPotentialTeams = new Map([...this.matchesPerTeam().entries()].filter(([key]) => key.includes(suspensionCategory)));
          playerPotentialTeams.forEach((matches, team) => {
            if (typeof lastNbMatchesSuspension === 'string') {
              const suspendedTeams = suspendedPlayers.get(player) ?? [];
              suspendedTeams.push({
                name: team.split(' Libre')[0],
                remaining: 999
              });
              suspendedPlayers.set(player, suspendedTeams);
            } else {
              const matchesPlayedSinceLastSuspension = matches.filter(match => this.isMatchCountable(match, lastSanction, today)).length;
              if (matchesPlayedSinceLastSuspension < lastNbMatchesSuspension) {
                const suspendedTeams = suspendedPlayers.get(player) ?? [];
                suspendedTeams.push({
                  name: team.split(' Libre')[0].split(' Foot Entreprise')[0],
                  remaining: lastNbMatchesSuspension - matchesPlayedSinceLastSuspension
                });
                suspendedPlayers.set(player, suspendedTeams);
              }
            }
          })
          if (suspendedPlayers.size !== 0) {
            suspendedPlayersByCategory.set(suspensionCategory, suspendedPlayers);
          }
        }
      }
    });
    this.suspendedPlayersByCategory.set(new Map(suspendedPlayersByCategory));
  }

  isMatchCountable(match: Match, sanction: Sanction, today: Date) {
    if (match.dateReport) {
      return match.dateReport >= sanction.dateDeffet && match.dateReport < today && !match.competition.includes("Amicaux");
    }
    return match.dateDuMatch >= sanction.dateDeffet && match.dateDuMatch < today && !match.competition.includes("Amicaux");
  }

  extractSuspensionMatches(text: string): number | string {
    if (text === 'Suspendu jusqu\'à réception de rapport et décision') {
      return text;
    }
    const match = text.match(/(\d+)\s+matchs?\s+de\s+suspension/i);
    let count: number = 0;
    if (match) {
      count += parseInt(match[1], 10);
    }
    if (text.toLowerCase().includes('automatique')) {
      count++;
    }
    return count;
  }

  protected readonly generatePdf = generatePdf;
}
