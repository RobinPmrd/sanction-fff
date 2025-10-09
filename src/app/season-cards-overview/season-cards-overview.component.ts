import { Component, computed, ElementRef, input, QueryList, signal, ViewChildren } from '@angular/core';
import { Sanction } from '../app.model';
import { NgClass } from '@angular/common';
import { CellHookData, MarginPaddingInput } from 'jspdf-autotable'
import { generatePdf } from '../utils';
import moment from 'moment/moment';

interface CardHistoric {
  player: string,
  subcategory: string
  yellowCards: number,
  redCards: number,
  whiteCards: number,
  totalCards: number,
  reasons: Reason[];
  totalCost: number
}

interface Reason {
  label: string,
  number: number
}

interface ColumnMappingLabelKey {
  label: string,
  key: CardHistoricKey
}

type CardHistoricKey = keyof CardHistoric;

@Component({
  selector: 'season-cards-overview',
  imports: [
    NgClass
  ],
  templateUrl: './season-cards-overview.component.html',
})
export class SeasonCardsOverviewComponent {
  @ViewChildren('table') tables!: QueryList<ElementRef<HTMLTableElement>>;

  columnLabels: ColumnMappingLabelKey[] = [
    { label: 'Nom', key: 'player' }, { label: 'Sous-catégorie', key: 'subcategory' }, { label: 'Carton jaunes', key: 'yellowCards' }, { label: 'Carton rouges', key: 'redCards' },
    { label: 'Carton blancs', key: 'whiteCards' }, { label: 'Total cartons', key: 'totalCards' }, { label: 'Motifs', key: 'reasons' }, { label: 'Amende totale', key: 'totalCost' }
  ]
  initialSorting: CardHistoricKey[] = ['totalCost', 'totalCards', 'redCards', 'yellowCards', 'whiteCards', 'player', 'subcategory'];
  pdfTitle = `Palmarès des cartons au ${moment().format('DD/MM/YYYY')}`;
  columnStyles = {
    0: { cellWidth: 9.35 },
    1: { cellWidth: 32.25 },
    3: { cellWidth: 14.87 },
    4: { cellWidth: 14.90 },
    5: { cellWidth: 14.87 },
    6: { cellWidth: 16.1925 },
    7: { cellWidth: 40 },
    8: { cellWidth: 21.52 },
  }
  margin: MarginPaddingInput = {
    left: 8,
    right: 8
  }

  sanctionPerPlayer = input.required<Map<string, Sanction[]>>();
  cardsHistoric = computed(() => {
    const cardsHistoric: CardHistoric[] = [];
    this.sanctionPerPlayer().forEach((sanctions, player) => {
      const cardHistoric = this.buildCardHistoric(sanctions, player);
      cardsHistoric.push(cardHistoric);
    })
    cardsHistoric.sort((a, b) => this.sortRaw(a, b));
    return cardsHistoric;
  });
  totals = computed(() => {
    const data = this.cardsHistoric();
    return {
      yellowCards: data.reduce((sum, r) => sum + (r.yellowCards || 0), 0),
      redCards: data.reduce((sum, r) => sum + (r.redCards || 0), 0),
      whiteCards: data.reduce((sum, r) => sum + (r.whiteCards || 0), 0),
      totalCards: data.reduce((sum, r) => sum + (r.totalCards || 0), 0),
      totalCost: data.reduce((sum, r) => sum + (r.totalCost || 0), 0)
    };
  })
  currentSorting = signal(this.initialSorting);
  sortDirection = signal<'asc' | 'desc'>('desc');
  sortColumn = signal<CardHistoricKey>('totalCost');

  buildCardHistoric(sanctions: Sanction[], player: string) {
    let cardHistoric: CardHistoric = {
      player: player,
      subcategory: sanctions[0].libelleSousCategorie,
      yellowCards: 0,
      redCards: 0,
      whiteCards: 0,
      totalCards: 0,
      reasons: [],
      totalCost: 0,
    };
    sanctions.forEach(sanction => {
      cardHistoric.yellowCards += sanction.nbreCartonsJaunes ?? 0;
      cardHistoric.redCards += sanction.cartonRouge === 'Oui' ? 1 : 0;
      cardHistoric.whiteCards += sanction.libelleDecision === 'Exclusion temporaire' ? 1 : 0;
      if (sanction.libelleMotif) {
        const reason = cardHistoric.reasons.find(reason => reason.label === sanction.libelleMotif);
        if (reason) {
          reason.number++;
        } else {
          cardHistoric.reasons.push({ label: sanction.libelleMotif, number: 1 });
        }
      }
      cardHistoric.totalCost += sanction.sommeTotale ?? 0;
    });
    cardHistoric.totalCards = cardHistoric.yellowCards + cardHistoric.redCards + cardHistoric.whiteCards;
    return cardHistoric;
  }

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

  formatCell(data: CellHookData) {
    data.cell.text = data.cell.text.map(text => text.replace(' >', '')
      .replace('🥇', '1')
      .replace('🥈', '2')
      .replace('🥉', '3'));
  }

  protected readonly generatePdf = generatePdf;
}
