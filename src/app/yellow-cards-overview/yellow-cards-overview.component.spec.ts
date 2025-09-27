import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YellowCardsOverviewComponent } from './yellow-cards-overview.component';

describe('YellowCardsOverviewComponent', () => {
  let component: YellowCardsOverviewComponent;
  let fixture: ComponentFixture<YellowCardsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YellowCardsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YellowCardsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
