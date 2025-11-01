import { Component, computed, effect, ElementRef, input, QueryList, signal, ViewChildren } from '@angular/core';
import { KeyValuePipe, NgClass } from '@angular/common';
import { Match, PdfOptions, PlayerSuspensions, Sanction, TeamNameMatching, TeamRemainingSuspension } from '../app.model';
import moment from 'moment/moment';
import { RemainingMatchesPipe } from '../pipe/remaining-matches.pipe';
import { ExportButtonComponent } from '../export-button/export-button.component';
import { CellObject, CellStyle } from 'xlsx-js-style';

@Component({
  selector: 'next-weekend-suspensions',
  imports: [
    KeyValuePipe,
    NgClass,
    RemainingMatchesPipe,
    ExportButtonComponent
  ],
  templateUrl: './next-weekend-suspensions.component.html',
})
export class NextWeekendSuspensionsComponent {
  @ViewChildren('table') tables!: QueryList<ElementRef<HTMLTableElement>>;

  sanctionsPerPlayer = input.required<Map<number, Sanction[]>>();
  matches = input.required<Match[]>();
  teamNameMatchings = input<TeamNameMatching[]>([]);
  process = input(false);

  hasProcess = signal(false);

  matchesPerTeam = computed(() =>
    Map.groupBy(this.matches().sort((a, b) => a.dateDuMatch.getTime() - b.dateDuMatch.getTime()), match => {
      const teamKey = this.getTeamKey(match);
      return this.teamNameMatchingPerTeam().get(teamKey) ?? teamKey;
    })
  );
  teamNameMatchingPerTeam = computed(() =>
    new Map(this.teamNameMatchings().map(teamNameMatching => [this.getTeamKey(teamNameMatching), teamNameMatching.nomEquipeInterne]))
  );
  categories = computed(() => Array.from(new Set(this.matches().map(match => match.categorieEquipeLocale))));

  suspendedPlayersByCategory = signal(new Map<string, Map<number, PlayerSuspensions>>);
  displayResult = computed(() => this.hasProcess() && this.suspendedPlayersByCategory().size !== 0);
  suspensionsByCategoryForExcel = computed(() => {
    const allTeams: Set<string> = new Set();
    this.suspendedPlayersByCategory().forEach(categorySuspendedPlayers => {
      categorySuspendedPlayers.forEach(playerSuspensions => {
        playerSuspensions.teams.forEach(team => {
          allTeams.add(team.name);
        });
      });
    });
    const sortedTeams = Array.from(allTeams).sort((a, b) => this.sortTeams(a, b, 'desc', 'asc'));

    const rows: Record<string, string | CellObject>[] = [];
    this.suspendedPlayersByCategory().forEach(categorySuspendedPlayers => {
      categorySuspendedPlayers.forEach(playerSuspensions => {
        let row: Record<string, string | CellObject> = {};
        row['Joueur'] = playerSuspensions.name;
        sortedTeams.forEach(teamName => {
          const value = playerSuspensions.teams.find(t => t.name === teamName)?.remaining;
          const isInfinite = value === 999;
          const cellValue = isInfinite ? '∞' : value ?? '';
          row[teamName] = {
            t: 's',
            v: cellValue,
            s: {
              font: isInfinite ? { sz: 14 } : undefined
            } as CellStyle
          };
        });
        rows.push(row);
      });
    });
    return rows;
  });

  sortTeams(a: string, b: string, categoryOrder: 'asc' | 'desc', teamOrder: 'asc' | 'desc'): number {
    const uRegex = /^U(\d+)/i;
    const aMatch = a.match(uRegex);
    const bMatch = b.match(uRegex);
    const aNum = aMatch ? parseInt(aMatch[1], 10) : 20;
    const bNum = bMatch ? parseInt(bMatch[1], 10) : 20;;
    if (aNum !== bNum) {
      return categoryOrder === 'asc' ? aNum - bNum : bNum - aNum;
    }
    return teamOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  }

  pdfOptions!: PdfOptions;

  constructor() {
    const today = moment();
    const nextSaturday = today.isoWeekday() <= 6
      ? today.clone().isoWeekday(6)
      : today.clone().add(1, 'week').isoWeekday(6);
    const saturdayDate = nextSaturday.format('DD/MM/YYYY');
    const nextSunday = nextSaturday.add(1, 'day');
    const sundayDate = nextSunday.format('DD/MM/YYYY');
    this.pdfOptions = {
      title: `Joueurs suspendus – Week-end du ${saturdayDate} au ${sundayDate}`
    };

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
    const suspendedPlayersByCategory = new Map<string, Map<number, PlayerSuspensions>>();
    this.sanctionsPerPlayer().forEach((sanction, player) => {
      const lastSanction = sanction[sanction.length - 1];
      const lastNbMatchesSuspension = this.extractSuspensionMatches(lastSanction);
      if (lastNbMatchesSuspension !== 0) {
        const subcategory = this.getSubCategory(lastSanction.libelleSousCategorie);
        const suspensionCategory = this.categories().find(category => category.includes(subcategory));
        if (suspensionCategory) {
          const categorySuspendedPlayers = suspendedPlayersByCategory.get(suspensionCategory) ?? new Map<number, PlayerSuspensions>;
          const playerTeams = this.getPlayerTeams(subcategory);
          const teamSuspensions = this.getTeamSuspensions(lastNbMatchesSuspension, playerTeams, lastSanction.dateDeffet, today);
          if (teamSuspensions.length > 0) {
            const playerSuspensions: PlayerSuspensions = {
              name: lastSanction.nomPrenomPersonne,
              teams: teamSuspensions
            };
            categorySuspendedPlayers.set(player, playerSuspensions);
          }
          if (categorySuspendedPlayers.size !== 0) {
            suspendedPlayersByCategory.set(suspensionCategory, categorySuspendedPlayers);
          }
        }
      }
    });
    this.suspendedPlayersByCategory.set(new Map(suspendedPlayersByCategory));
  }

  getTeamSuspensions(matchesSuspensionNb: number | string, playerTeams: string[], sanctionStartDate: Date | null, today: Date) {
    const teamSuspensions: TeamRemainingSuspension[] = [];
    const startDate = sanctionStartDate ?? today;
    startDate.setHours(0, 0, 0, 0);
    playerTeams.forEach(team => {
      const teamMatches = this.matchesPerTeam().get(team) ?? [];
      const nextMatchDate = teamMatches.map(match => match.dateReport ?? match.dateDuMatch).find(matchDate => matchDate > today);
      if (nextMatchDate && startDate > nextMatchDate) {
        return;
      }
      if (typeof matchesSuspensionNb === 'string') {
        teamSuspensions.push({
          name: team.split('Libre')[0],
          remaining: 999
        });
      } else {
        const matchesPlayedSinceLastSuspension = teamMatches.filter(match => this.isMatchCountable(match, startDate, today)).length;
        if (matchesPlayedSinceLastSuspension < matchesSuspensionNb) {
          teamSuspensions.push({
            name: team.split('Libre')[0].split('Foot Entreprise')[0],
            remaining: matchesSuspensionNb - matchesPlayedSinceLastSuspension
          });
        }
      }
    });
    return teamSuspensions.sort((a, b) => this.sortTeams(a.name, b.name, 'asc', 'asc'));
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

  getTeamKey(data: Match | TeamNameMatching) {
    if ('equipeLocale' in data) {
      return data.equipeLocale.trim() + data.categorieEquipeLocale.trim();
    }
    return data.nomEquipeFootclub.trim() + data.categorieFootclub.trim();
  }

  getSubCategory(subcategory: string) {
    if (subcategory.includes('Entreprise')) {
      return 'Entreprise';
    } else if ((subcategory.includes('Vétéran') && subcategory.includes('Libre')) || subcategory.includes('Senior')) {
      return 'Libre / Senior';
    } else {
      const match = subcategory.match(/u\s*(\d{1,2})/i);
      return match ? match[0] : subcategory;
    }
  }

  getPlayerTeams(subcategory: string) {
    const playerTeams: string[] = [];
    this.matches().forEach(match => {
      const teamKey = this.getTeamKey(match);
      const teamName = this.teamNameMatchingPerTeam().get(teamKey) ?? teamKey;
      if (!playerTeams.includes(teamName) && this.isPlayerTeam(subcategory, match)) {
        playerTeams.push(teamName);
      }
    });
    return playerTeams;
  }

  isPlayerTeam(subcategory: string, match: Match) {
    if (subcategory === 'Entreprise' || subcategory === 'Libre / Senior') {
      return match.categorieEquipeLocale.includes(subcategory);
    }
    const categoryNumberMatches = [...match.categorieEquipeLocale.matchAll(/u\s*(\d{1,2})/gi)].map(m => m[1]);
    const subcategoryNumberMatch = subcategory.match(/u\s*(\d{1,2})/i);
    if (categoryNumberMatches && subcategoryNumberMatch && categoryNumberMatches.length > 1 && categoryNumberMatches[1] === subcategoryNumberMatch[1]) {
      return true;
    }
    const competitionSubcategoryNumberMatch = match.categorieEquipeLocale === 'Libre / Senior' ? ['U20', '20'] : match.competition.match(/u\s*(\d{1,2})/i);
    if (subcategoryNumberMatch && competitionSubcategoryNumberMatch) {
      const subcategoryNumber = Number.parseInt(subcategoryNumberMatch[1]);
      const competitionSubcategoryNumber = Number.parseInt(competitionSubcategoryNumberMatch[1]);
      return subcategoryNumber <= competitionSubcategoryNumber && competitionSubcategoryNumber - subcategoryNumber <= 2;
    }
    return !subcategoryNumberMatch;
  }
}
