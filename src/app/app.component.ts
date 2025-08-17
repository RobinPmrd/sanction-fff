import {Component, computed, signal, WritableSignal} from '@angular/core';
import * as XLSX from 'xlsx';
import {Match, Sanction, TeamSuspension} from './app.model';
import {KeyValuePipe, NgClass} from '@angular/common';
import {parseDate, toCamelCase} from './utils';

@Component({
  selector: 'app-root',
  imports: [
    KeyValuePipe,
    NgClass
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  matches = signal<Match[]>([]);
  matchesPerTeam = computed(() =>
    Map.groupBy(this.matches().sort((a, b) => a.dateDuMatch.getTime() - b.dateDuMatch.getTime()),
      match => match.equipeLocale + " " + match.categorieEquipeLocale)
  );
  competitionToCategory = computed(() => {
    return new Map(this.matches().map(match => [match.competition, match.categorieEquipeLocale]))
  });
  sanctions = signal<Sanction[]>([]);
  sanctionPerPlayer = computed(() => Map.groupBy(this.sanctions(), sanction => sanction.nomPrenomPersonne));
  suspendedPlayersByCategory = new Map<string, Map<string, TeamSuspension[]>>;
  disableButton = computed(() => this.sanctions().length === 0 || this.matches().length === 0);

  onFileChange<T>(event: any, signal: WritableSignal<T[]>) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e:  ProgressEvent<FileReader>) => {
      if (e.target) {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, {raw: true});
        const data: T[] = rawData.map(row => this.formatData(row));
        signal.set(data);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  formatData<T extends Record<string, any>>(obj: T): any {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [toCamelCase(key), parseDate(value)])
    );
  }

  sanctionAnalysis() {
    const today = new Date();
    this.sanctionPerPlayer().forEach((sanction, player) => {
      const lastSanction = sanction[sanction.length - 1];
      const lastNbMatchesSuspension = this.extractSuspensionMatches(lastSanction.libelleDecision);
      if (lastNbMatchesSuspension) {
        const suspensionCategory = this.competitionToCategory().get(lastSanction.competition);
        if (suspensionCategory) {
          const suspendedPlayers = this.suspendedPlayersByCategory.get(suspensionCategory) ?? new Map<string, TeamSuspension[]>;
          const playerPotentialTeams = new Map([...this.matchesPerTeam().entries()].filter(([key]) => key.includes(suspensionCategory)));
          playerPotentialTeams.forEach((matches, team) => {
            if (typeof lastNbMatchesSuspension === 'string') {
              const suspendedTeams = suspendedPlayers.get(player) ?? [];
              suspendedTeams.push({
                name: team.split(' Libre')[0],
                remaining: 999
              });
              suspendedPlayers.set(player, suspendedTeams);
            }
            else {
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
            this.suspendedPlayersByCategory.set(suspensionCategory, suspendedPlayers);
          }
        }
      }
    })
  }

  isMatchCountable(match: Match, sanction: Sanction, today: Date) {
    return match.dateDuMatch >= sanction.dateDeffet && match.dateDuMatch < today && !match.competition.includes("Amicaux");
  }

  extractSuspensionMatches(text: string): number| string | null {
    if (text === 'Suspendu jusqu\'à réception de rapport et décision') {
      return text;
    }
    const match = text.match(/(\d+)\s+matchs?\s+de\s+suspension/i);
    return match ? parseInt(match[1], 10) : null;
  }
}
