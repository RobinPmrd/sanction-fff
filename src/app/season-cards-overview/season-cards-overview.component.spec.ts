import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonCardsOverviewComponent } from './season-cards-overview.component';
import { setInput } from '../utils';
import { Sanction } from '../app.model';
import { ComponentRef } from '@angular/core';
import { seniorPlayer } from '../app.component.spec';

describe('SeasonCardsOverviewComponent', () => {
  let component: SeasonCardsOverviewComponent;
  let componentRef: ComponentRef<SeasonCardsOverviewComponent>;
  let fixture: ComponentFixture<SeasonCardsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonCardsOverviewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SeasonCardsOverviewComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-11') }]]
    ]));
    expect(component).toBeTruthy();
  });
});
