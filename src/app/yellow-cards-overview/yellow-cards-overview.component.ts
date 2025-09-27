import { Component, computed, input } from '@angular/core';
import { Sanction } from '../app.model';
import { DatePipe, KeyValuePipe } from '@angular/common';

interface YellowCardData {
  number: number,
  endDate: Date,
  subcategory: string
}

@Component({
  selector: 'yellow-cards-overview',
  imports: [
    KeyValuePipe,
    DatePipe
  ],
  templateUrl: './yellow-cards-overview.component.html',
})
export class YellowCardsOverviewComponent {
  sanctionPerPlayer = input.required<Map<string, Sanction[]>>();
  yellowCardsByPlayer = computed(() => {
    const yellowCardsByPlayer = new Map<string, YellowCardData>();
    const today = new Date();
    this.sanctionPerPlayer().forEach((sanction, player) => {
      const lastSanction = sanction[sanction.length - 1];
      const yellowCards = this.extractYellowCardsInPeriod(lastSanction, today);
      if (yellowCards) {
        const yellowCardData: YellowCardData = {
          number: yellowCards,
          endDate: lastSanction.dateDeFin,
          subcategory: lastSanction.libelleSousCategorie
        }
        yellowCardsByPlayer.set(player, yellowCardData);
      }
    })
    console.log(yellowCardsByPlayer);
    return yellowCardsByPlayer;
  });

  extractYellowCardsInPeriod(sanction: Sanction, today: Date): number | null {
    if (sanction.dateDeFin && sanction.dateDeFin < today) {
      return null;
    }
    const libelleDecision = sanction.libelleDecision.toLowerCase();
    if (libelleDecision === ('inscription au fichier')) {
      return 1;
    }
    else if (libelleDecision.includes('inscription au fichier')) {
      return 2
    }
    return null;
  }
}
