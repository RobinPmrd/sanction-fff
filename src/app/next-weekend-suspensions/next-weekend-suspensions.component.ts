import { Component, computed, effect, input, signal } from '@angular/core';
import { KeyValuePipe, NgClass } from '@angular/common';
import { Match, Sanction, TeamSuspension } from '../app.model';

@Component({
  selector: 'next-weekend-suspensions',
  imports: [
    KeyValuePipe,
    NgClass
  ],
  templateUrl: './next-weekend-suspensions.component.html',
})
export class NextWeekendSuspensionsComponent {
  sanctions = input.required<Sanction[]>();
  matches = input.required<Match[]>();
  process = input(false);

  hasProcess = signal(false);
  errors = signal<string[]>([]);

  matchesPerTeam = computed(() =>
    Map.groupBy(this.matches().sort((a, b) => a.dateDuMatch.getTime() - b.dateDuMatch.getTime()),
      match => match.equipeLocale + " " + match.categorieEquipeLocale)
  );
  competitionToCategory = computed(() => {
    return new Map(this.matches().map(match => [match.competition, match.categorieEquipeLocale]))
  });
  sanctionPerPlayer = computed(() => Map.groupBy(this.sanctions(), sanction => sanction.nomPrenomPersonne));
  suspendedPlayersByCategory = signal(new Map<string, Map<string, TeamSuspension[]>>);
  displayResult = computed(() => this.hasProcess() && this.suspendedPlayersByCategory().size !== 0);

  constructor() {
    effect(() => {
      if (this.process()) {
        this.sanctionAnalysis();
      }
    });
  }

  checkSeasonMatching() {
    const sanctionSeasons = new Set(
      this.sanctions().map(s => this.getSeason(s.dateDeffet))
    );
    const matchSeasons = new Set(
      this.matches().map(m => this.getSeason(m.dateDuMatch))
    );
    for (const season of sanctionSeasons) {
      if (!matchSeasons.has(season)) {
        return false;
      }
    }
    return true;
  }

  getSeason(date: Date) {
    const month = date.getMonth();
    return month >= 1 && month <= 6 ? date.getFullYear() : date.getFullYear() + 1;
  }

  sanctionAnalysis() {
    this.hasProcess.set(true);
    if (!this.checkSeasonMatching()) {
      this.suspendedPlayersByCategory.update(() => new Map());
      this.errors.set(["Le fichier sanctions et rencontres ne datent pas de la même saison"]);
    }
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
                  name: team.split(' Libre')[0],
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
}
