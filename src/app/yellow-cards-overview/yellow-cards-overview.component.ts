import { Component, computed, input } from '@angular/core';
import { Sanction } from '../app.model';
import { DatePipe } from '@angular/common';

interface YellowCardData {
  player: string,
  number: number,
  endDate: Date,
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
  sanctionPerPlayer = input.required<Map<string, Sanction[]>>();
  yellowCardsData = computed(() => {
    const yellowCardsData: YellowCardData[] = [];
    const today = new Date();
    this.sanctionPerPlayer().forEach((sanction, player) => {
      const lastSanction = sanction[sanction.length - 1];
      const yellowCards = this.extractYellowCardsInPeriod(lastSanction, today);
      if (yellowCards) {
        const yellowCardData: YellowCardData = {
          player: player,
          number: yellowCards,
          endDate: lastSanction.dateDeFin!,
          subcategory: lastSanction.libelleSousCategorie
        }
        yellowCardsData.push(yellowCardData);
      }
    })
    yellowCardsData.sort((a,b) => this.sortByYellowCardAndEndDate(a, b));
    return yellowCardsData;
  });

  extractYellowCardsInPeriod(sanction: Sanction, today: Date): number | null {
    if (sanction.dateDeFin && sanction.dateDeFin < today) {
      return null;
    }
    const libelleDecision = sanction.libelleDecision.toLowerCase();
    if (libelleDecision === ('inscription au fichier')) {
      return 1;
    } else if (libelleDecision.includes('inscription au fichier')) {
      return 2
    }
    return null;
  }


    sortByYellowCardAndEndDate(a: YellowCardData, b: YellowCardData) {
      if (a.number === b.number) {
        return b.endDate > a.endDate ? -1 : 1;
      }
      return a.number > b.number ? -1 : 1;
    }
}
