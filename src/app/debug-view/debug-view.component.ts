import { Component, computed, input, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Match, Sanction } from '../app.model';

@Component({
  selector: 'debug-view',
  imports: [DatePipe, NgClass],
  templateUrl: './debug-view.component.html'
})
export class DebugViewComponent {
  sanctions = input.required<Sanction[]>();
  matches = input.required<Match[]>();

  activeSection = signal<'sanctions' | 'matches'>('sanctions');

  sanctionFilter = signal('');

  matchCategoryFilter = signal('');
  matchTeamFilter = signal('');

  filteredSanctions = computed(() => {
    const filter = this.sanctionFilter().toLowerCase().trim();
    if (!filter) return this.sanctions();

    return this.sanctions().filter(sanction => {
      const playerName = sanction.nomPrenomPersonne.toLowerCase();
      const playerNumber = String(sanction.numeroPersonne);
      return playerName.includes(filter) || playerNumber.includes(filter);
    });
  });

  filteredMatches = computed(() => {
    const categoryFilter = this.matchCategoryFilter().toLowerCase().trim();
    const teamFilter = this.matchTeamFilter().toLowerCase().trim();

    return this.matches().filter(match => {
      const matchCategory = match.categorieEquipeLocale.toLowerCase();
      const matchTeamLocale = match.equipeLocale.toLowerCase();

      const matchesCategory = !categoryFilter || matchCategory.includes(categoryFilter);
      const matchesTeam = !teamFilter || matchTeamLocale === teamFilter;

      return matchesCategory && matchesTeam;
    });
  });

  categories = computed(() => {
    return Array.from(new Set(this.matches().map(m => m.categorieEquipeLocale))).sort();
  });

  teamNames = computed(() => {
    const categoryFilter = this.matchCategoryFilter();
    const matches = categoryFilter
      ? this.matches().filter(m => m.categorieEquipeLocale === categoryFilter)
      : this.matches();
    return Array.from(new Set(matches.map(m => m.equipeLocale))).sort();
  });

  switchSection(section: 'sanctions' | 'matches') {
    this.activeSection.set(section);
  }

  onCategoryChange() {
    this.matchTeamFilter.set('');
  }
}
