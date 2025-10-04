import { Component, computed, input, signal } from '@angular/core';
import { Sanction } from '../app.model';

interface CardHistoric {
  player: string,
  subcategory: string
  yellowCards: number,
  redCards: number,
  totalCost: number
}

interface ColumnMappingLabelKey {
  label: string,
  key: CardHistoricKey
}

type CardHistoricKey = keyof CardHistoric;

@Component({
  selector: 'season-cards-overview',
  imports: [],
  templateUrl: './season-cards-overview.component.html',
})
export class SeasonCardsOverviewComponent {
  sanctionPerPlayer = input.required<Map<string, Sanction[]>>();
  cardsHistoric = computed(() => {
    const cardsHistoric: CardHistoric[] = [];
    this.sanctionPerPlayer().forEach((sanctions, player) => {
      let cardHistoric: CardHistoric = {
        player: player,
        subcategory: sanctions[0].libelleSousCategorie,
        yellowCards: 0,
        redCards: 0,
        totalCost: 0,
      };
      sanctions.forEach(sanction => {
        cardHistoric.yellowCards += sanction.nbreCartonsJaunes ?? 0;
        cardHistoric.redCards += sanction.cartonRouge === 'Oui' ? 1 : 0;
        cardHistoric.totalCost += sanction.sommeTotale ?? 0;
      })
      cardsHistoric.push(cardHistoric);
    })
    cardsHistoric.sort((a, b) => this.sortRaw(a, b));
    return cardsHistoric;
  });
  columnLabels: ColumnMappingLabelKey[] = [{label: 'Nom', key: 'player'}, {label: 'Sous-catégorie', key: 'subcategory'}, {
    label: 'Carton jaunes',
    key: 'yellowCards'
  }, {label: 'Carton rouges', key: 'redCards'}, {label: 'Amende totale', key: 'totalCost'}]
  initialSorting: CardHistoricKey[] = ['totalCost', 'redCards', 'yellowCards', 'player', 'subcategory'];
  currentSorting = signal(this.initialSorting);
  sortDirection = signal<'asc' | 'desc'>('desc');
  sortColumn = signal<CardHistoricKey>('totalCost');

  sortRaw(a: CardHistoric, b: CardHistoric) {
    if (a.subcategory === ' / ') {
      return 1;
    }
    if (b.subcategory === ' / ') {
      return -1;
    }
    for (let index = 0; index < this.currentSorting().length; index++) {
      const column = this.currentSorting()[index];
      const valueA = a[column];
      const valueB = b[column];

      if (index !== this.currentSorting().length - 1 && valueA === valueB) {
        continue;
      }
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection() === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return this.sortDirection() === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    }
    return 0;
  }

  onSortColumn(sortColumn: CardHistoricKey) {
    if (this.sortColumn() === sortColumn) {
      this.sortDirection.update(sortDir => sortDir === 'asc' ? 'desc' : 'asc');
    }
    this.sortColumn.set(sortColumn);
    this.currentSorting.update(currentSorting => {
      const columnIndex = currentSorting.findIndex(column => column === sortColumn);
      const newSorting = currentSorting.toSpliced(columnIndex, 1);
      newSorting.unshift(sortColumn);
      return newSorting;
    });
  }
}
