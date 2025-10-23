import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YellowCardsOverviewComponent } from './yellow-cards-overview.component';
import { setInput } from '../utils';
import { Sanction } from '../app.model';
import { seniorPlayer } from '../app.component.spec';
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
  });

  it('should create', () => {
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-11') }]]
    ]));
    expect(component).toBeTruthy();
  });
});
