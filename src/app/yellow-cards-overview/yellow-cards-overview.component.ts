import { Component, computed, ElementRef, input, QueryList, ViewChildren } from '@angular/core';
import { Sanction } from '../app.model';
import { DatePipe } from '@angular/common';
import { generatePdf } from '../utils';
import moment from 'moment';

interface YellowCardData {
  player: string,
  number: number,
  endDates: Date[],
  subcategory: string
}

@Component({
  selector: 'yellow-cards-overview',
  imports: [
    DatePipe
  ],
  templateUrl: './yellow-cards-overview.component.html',
})
export class YellowCardsOverviewComponent {
  @ViewChildren('table') tables!: QueryList<ElementRef<HTMLTableElement>>;

  sanctionPerPlayer = input.required<Map<string, Sanction[]>>();
  yellowCardsData = computed(() => {
    const yellowCardsData: YellowCardData[] = [];
    const today = new Date();
    this.sanctionPerPlayer().forEach((sanctions, player) => {
      const yellowCardData = this.buildYellowCardData(sanctions, player, today);
      if (yellowCardData.number > 0) {
        yellowCardsData.push(yellowCardData);
      }
    })
    yellowCardsData.sort((a, b) => this.sortByYellowCardAndEndDate(a, b));
    return yellowCardsData;
  });

  pdfTitle = `Cartons jaunes actifs au ${moment().format('DD/MM/YYYY')}`;

  buildYellowCardData(sanctions: Sanction[], player: string, today: Date): YellowCardData {
    const yellowCardData: YellowCardData = {
      player: player,
      subcategory: sanctions[0].libelleSousCategorie,
      endDates: [],
      number: 0,
    }
    sanctions.forEach(sanction => {
      const yellowCards = this.isYellowCardInPeriod(sanction, today);
      if (yellowCards) {
        yellowCardData.endDates.push(sanction.dateDeFin!);
        yellowCardData.number++;
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

  protected readonly generatePdf = generatePdf;
}
