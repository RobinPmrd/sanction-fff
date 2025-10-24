import { Component, computed, effect, signal } from '@angular/core';
import { Match, Sanction, TeamNameMatching } from './app.model';
import { FileInputComponent } from './file-input/file-input.component';
import { NextWeekendSuspensionsComponent } from './next-weekend-suspensions/next-weekend-suspensions.component';
import { YellowCardsOverviewComponent } from './yellow-cards-overview/yellow-cards-overview.component';
import { NgClass } from '@angular/common';
import { SeasonCardsOverviewComponent } from './season-cards-overview/season-cards-overview.component';

@Component({
  selector: 'app-root',
  imports: [
    FileInputComponent,
    NextWeekendSuspensionsComponent,
    YellowCardsOverviewComponent,
    NgClass,
    SeasonCardsOverviewComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  matches = signal<Match[]>([]);
  sanctions = signal<Sanction[]>([]);
  teamNameMatchings = signal<TeamNameMatching[]>([]);
  launchTreatment = signal(false);
  sanctionsFileHasErrors = signal(false);
  matchesFileHasErrors = signal(false);
  tab = signal(0);
  errors = signal<string[]>([]);

  sanctionsPerPlayer = computed(() => Map.groupBy(this.sanctions(), sanction => sanction.numeroPersonne));
  hasErrors = computed(() => this.sanctionsFileHasErrors() || this.matchesFileHasErrors() || this.errors().length !== 0);
  disableButton = computed(() => this.sanctions().length === 0 || this.matches().length === 0 || this.hasErrors());

  requiredColumns = {
    sanction: ['Nom, prénom personne', 'Numéro personne', 'Compétition', 'Date d\'effet', 'Libellé décision', 'Libellé sous catégorie'],
    match: ['Compétition', 'Catégorie équipe locale', 'Equipe locale', 'Date du match', 'Date report'],
    teamNameMatching: ['Catégorie Footclub', 'Nom équipe Footclub', 'Nom équipe interne']
  }

  constructor() {
    effect(() => {
      if (this.matches().length !== 0 && this.sanctions().length !== 0) {
        if (!this.checkSeasonMatching()) {
          this.errors.set(["Le fichier sanctions et rencontres ne datent pas de la même saison"]);
          this.launchTreatment.set(false);
        } else {
          this.errors.set([]);
        }
      }
    })
  }

  onLaunchTreatmentClick() {
    this.launchTreatment.set(true);
  }

  checkSeasonMatching() {
    const sanctionSeasons = new Set(
      this.sanctions().map(s => this.getSeason(s.dateDeffet ?? new Date()))
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
    return month >= 0 && month <= 6 ? date.getFullYear() : date.getFullYear() + 1;
  }
}
