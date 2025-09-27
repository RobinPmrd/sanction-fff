import { Component, computed, signal } from '@angular/core';
import { Match, Sanction } from './app.model';
import { FileInputComponent } from './file-input/file-input.component';
import { NextWeekendSuspensionsComponent } from './next-weekend-suspensions/next-weekend-suspensions.component';
import { YellowCardsOverviewComponent } from './yellow-cards-overview/yellow-cards-overview.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    FileInputComponent,
    NextWeekendSuspensionsComponent,
    YellowCardsOverviewComponent,
    NgClass
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  matches = signal<Match[]>([]);
  sanctions = signal<Sanction[]>([]);
  launchTreatment = signal(false);
  sanctionsFileHasErrors = signal(false);
  matchesFileHasErrors = signal(false);
  tab = signal(0);

  sanctionPerPlayer = computed(() => Map.groupBy(this.sanctions(), sanction => sanction.nomPrenomPersonne));
  hasErrors = computed(() => this.sanctionsFileHasErrors() || this.matchesFileHasErrors());
  disableButton = computed(() => this.sanctions().length === 0 || this.matches().length === 0 || this.hasErrors());

  requiredColumns = {
    sanction: ['Nom, prénom personne', 'Compétition', 'Date d\'effet', 'Libellé décision', 'Libellé sous catégorie'],
    match: ['Compétition', 'Catégorie équipe locale', 'Equipe locale', 'Date du match', 'Date report']
  }

  onLaunchTreatmentClick() {
    this.launchTreatment.set(true);
  }
}
