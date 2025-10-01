import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;
  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent]
    });

    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;
  })

  it('should display not same season error when sanction from past season without match', () => {
    appComponent.matches.set([
      {
        nomAbrege: "REG 1",
        competition: "Régional 1 Intersport",
        numeroPhase: 1,
        numeroDeJournee: 1,
        numeroDeTour: "",
        numeroMatch: 2,
        categorieEquipeLocale: "Libre / Senior",
        equipeLocale: "TEAM 1",
        dateDuMatch: new Date("2024-09-07"),
        dateReport: ""
      }
    ]);
    appComponent.sanctions.set([
      {
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: 'Inscription Au Fichier',
        dateDeffet: new Date('2023-05-18'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: new Date('2024-12-18'),
        nbreCartonsJaunes: 1,
        cartonRouge: 'Non'
      }
    ]);

    fixture.detectChanges();

    // THEN
    const analysisErrors = appComponent.errors();
    expect(analysisErrors?.length).toBe(1);
    expect(appComponent.launchTreatment()).toBeFalsy();
  })
})
