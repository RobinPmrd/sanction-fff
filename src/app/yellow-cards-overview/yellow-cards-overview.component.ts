import { Component, computed, ElementRef, input, QueryList, ViewChildren } from '@angular/core';
import { PdfOptions, Sanction } from '../app.model';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { ExportButtonComponent } from '../export-button/export-button.component';
import { CellObject } from 'xlsx-js-style';

export interface YellowCardData {
  player: string,
  number: number,
  endDates: Date[],
  subcategory: string
}

@Component({
  selector: 'yellow-cards-overview',
  imports: [
    DatePipe,
    ExportButtonComponent
  ],
  templateUrl: './yellow-cards-overview.component.html',
})
export class YellowCardsOverviewComponent {
  @ViewChildren('table') tables!: QueryList<ElementRef<HTMLTableElement>>;

  sanctionsPerPlayer = input.required<Map<number, Sanction[]>>();
  yellowCardsData = computed(() => {
    const yellowCardsData: YellowCardData[] = [];
    const today = new Date();
    this.sanctionsPerPlayer().forEach((sanctions) => {
      const yellowCardData = this.buildYellowCardData(sanctions, today);
      if (yellowCardData.number > 0) {
        yellowCardsData.push(yellowCardData);
      }
    })
    yellowCardsData.sort((a, b) => this.sortByYellowCardAndEndDate(a, b));
    return yellowCardsData;
  });
  yellowCardsDataForExcel = computed(() => {
    return this.yellowCardsData().map(yellowCardData => {
      const row: Record<string, string | CellObject> = {};
      row['player'] = yellowCardData.player;
      row['subcategory'] = yellowCardData.subcategory;
      row['nbYellowCards'] = {
        t: 'n',
        v: yellowCardData.number
      }
      row['firstEndDate'] = {
        t: 'd',
        v: yellowCardData.endDates[0]
      };
      if (yellowCardData.number == 2) {
        row['secondEndDate'] = {
          t: 'd',
          v: yellowCardData.endDates[1]
        };
      }
      return row;
    });
  });

  pdfOptions: PdfOptions = {
    title: `Cartons jaunes actifs au ${moment().format('DD/MM/YYYY')}`,
    columnStyles: {
      4: { cellWidth: 37.84 },
    }
  }

  buildYellowCardData(sanctions: Sanction[], today: Date): YellowCardData {
    const yellowCardData: YellowCardData = {
      player: sanctions[0].nomPrenomPersonne,
      subcategory: sanctions[0].libelleSousCategorie,
      endDates: [],
      number: 0,
    }
    sanctions.forEach(sanction => {
      if (this.isYellowCardInPeriod(sanction, today) && yellowCardData.number < 2) {
        yellowCardData.endDates.push(sanction.dateDeFin!);
        yellowCardData.number++;
      } else {
        yellowCardData.endDates = [];
        yellowCardData.number = 0;
      }
    });
    return yellowCardData;
  }

  isYellowCardInPeriod(sanction: Sanction, today: Date): boolean {
    if (!sanction.dateDeFin || sanction.dateDeFin < today) {
      return false;
    }
    return sanction.nbreCartonsJaunes === 1;
  }

  sortByYellowCardAndEndDate(a: YellowCardData, b: YellowCardData) {
    if (a.number === b.number) {
      return b.endDates[0] > a.endDates[0] ? -1 : 1;
    }
    return a.number > b.number ? -1 : 1;
  }
}
