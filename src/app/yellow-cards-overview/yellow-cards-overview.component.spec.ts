import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YellowCardData, YellowCardsOverviewComponent } from './yellow-cards-overview.component';
import { setInput } from '../utils';
import { Sanction } from '../app.model';
import { seniorPlayer, u18Player } from '../app.component.spec';
import { ComponentRef } from '@angular/core';

describe('YellowCardsOverviewComponent', () => {
  let component: YellowCardsOverviewComponent;
  let componentRef: ComponentRef<YellowCardsOverviewComponent>;
  let fixture: ComponentFixture<YellowCardsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YellowCardsOverviewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(YellowCardsOverviewComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    jest.useFakeTimers().setSystemTime(new Date('2025-10-23'));
  });

  it('nominal case', () => {
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2025-10-21'), dateDeFin: new Date('2026-01-21'), cartonRouge: 'Non', nbreCartonsJaunes: 1 }]],
      [u18Player.numeroPersonne, [
        { ...u18Player, dateDeffet: new Date('2025-10-01'), dateDeFin: new Date('2026-01-01'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-08'), dateDeFin: new Date('2026-01-08'), cartonRouge: 'Non', nbreCartonsJaunes: 1 }
      ]],
    ]));
    const expectedYellowCardsData: YellowCardData[] = [
      { player: u18Player.nomPrenomPersonne, number: 2, endDates: [new Date('2026-01-01'), new Date('2026-01-08')], subcategory: u18Player.libelleSousCategorie },
      { player: seniorPlayer.nomPrenomPersonne, number: 1, endDates: [new Date('2026-01-21')], subcategory: seniorPlayer.libelleSousCategorie },
    ]
    expect(component.yellowCardsData()).toEqual(expectedYellowCardsData);
  });

  it('should not be in yellow cards array anymore when end date passed', () => {
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2025-07-21'), dateDeFin: new Date('2025-10-21'), cartonRouge: 'Non', nbreCartonsJaunes: 1 }]],
    ]));
    expect(component.yellowCardsData().length).toEqual(0);
  });

  it('should not be in yellow cards array anymore when red card', () => {
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [u18Player.numeroPersonne, [
        { ...u18Player, dateDeffet: new Date('2025-10-01'), dateDeFin: new Date('2026-01-01'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-08'), dateDeFin: new Date('2026-01-08'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-15') }
      ]],
    ]));
    expect(component.yellowCardsData().length).toEqual(0);
  });

  it('should not be in yellow cards array anymore when third yellow card in period', () => {
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [u18Player.numeroPersonne, [
        { ...u18Player, dateDeffet: new Date('2025-10-01'), dateDeFin: new Date('2026-01-01'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-08'), dateDeFin: new Date('2026-01-08'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-15'), cartonRouge: 'Non', nbreCartonsJaunes: 1 }
      ]],
    ]));
    expect(component.yellowCardsData().length).toEqual(0);
  });

  it('should be in yellow cards array when yellow card after 3 yellow cards', () => {
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [u18Player.numeroPersonne, [
        { ...u18Player, dateDeffet: new Date('2025-10-01'), dateDeFin: new Date('2026-01-01'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-08'), dateDeFin: new Date('2026-01-08'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-15'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-21'), dateDeFin: new Date('2026-01-21'), cartonRouge: 'Non', nbreCartonsJaunes: 1 }
      ]],
    ]));
    const expectedYellowCardsData: YellowCardData[] = [
      { player: u18Player.nomPrenomPersonne, number: 1, endDates: [new Date('2026-01-21')], subcategory: u18Player.libelleSousCategorie }
    ]
    expect(component.yellowCardsData()).toEqual(expectedYellowCardsData);
  });

  it('should be in yellow cards array when yellow card after 3 yellow cards', () => {
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [u18Player.numeroPersonne, [
        { ...u18Player, dateDeffet: new Date('2025-10-01'), dateDeFin: new Date('2026-01-01'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-08'), dateDeFin: new Date('2026-01-08'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-15'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-21'), dateDeFin: new Date('2026-01-21'), cartonRouge: 'Non', nbreCartonsJaunes: 1 }
      ]],
    ]));
    const expectedYellowCardsData: YellowCardData[] = [
      { player: u18Player.nomPrenomPersonne, number: 1, endDates: [new Date('2026-01-21')], subcategory: u18Player.libelleSousCategorie }
    ]
    expect(component.yellowCardsData()).toEqual(expectedYellowCardsData);
  });

  it('should be in yellow cards array when yellow card after 2 yellow cards and 1 red card', () => {
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [u18Player.numeroPersonne, [
        { ...u18Player, dateDeffet: new Date('2025-10-01'), dateDeFin: new Date('2026-01-01'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-08'), dateDeFin: new Date('2026-01-08'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-15') },
        { ...u18Player, dateDeffet: new Date('2025-10-21'), dateDeFin: new Date('2026-01-21'), cartonRouge: 'Non', nbreCartonsJaunes: 1 }
      ]],
    ]));
    const expectedYellowCardsData: YellowCardData[] = [
      { player: u18Player.nomPrenomPersonne, number: 1, endDates: [new Date('2026-01-21')], subcategory: u18Player.libelleSousCategorie }
    ]
    expect(component.yellowCardsData()).toEqual(expectedYellowCardsData);
  });

  it('should be in yellow cards array when 1 yellow card out of period and 2 in period', () => {
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [u18Player.numeroPersonne, [
        { ...u18Player, dateDeffet: new Date('2025-07-01'), dateDeFin: new Date('2025-10-01'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-08'), dateDeFin: new Date('2026-01-08'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
        { ...u18Player, dateDeffet: new Date('2025-10-15'), dateDeFin: new Date('2026-01-15'), cartonRouge: 'Non', nbreCartonsJaunes: 1 },
      ]],
    ]));
    const expectedYellowCardsData: YellowCardData[] = [
      { player: u18Player.nomPrenomPersonne, number: 2, endDates: [new Date('2026-01-08'), new Date('2026-01-15')], subcategory: u18Player.libelleSousCategorie }
    ]
    expect(component.yellowCardsData()).toEqual(expectedYellowCardsData);
  });
});
