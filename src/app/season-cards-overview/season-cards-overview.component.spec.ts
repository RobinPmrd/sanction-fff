import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonCardsOverviewComponent } from './season-cards-overview.component';

describe('SeasonCardsOverviewComponent', () => {
  let component: SeasonCardsOverviewComponent;
  let fixture: ComponentFixture<SeasonCardsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonCardsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonCardsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
