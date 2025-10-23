import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Match, Sanction } from './app.model';

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
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-07") }
    ]);
    appComponent.sanctions.set([
      { ...seniorPlayer, dateDeffet: new Date('2023-05-18') }
    ]);

    fixture.detectChanges();

    // THEN
    const analysisErrors = appComponent.errors();
    expect(analysisErrors?.length).toBe(1);
    expect(appComponent.launchTreatment()).toBeFalsy();
  })
})

export const seniorTeam1Match: Match = {
  competition: "Régional 1 Intersport",
  categorieEquipeLocale: "Libre / Senior",
  equipeLocale: "TEAM 1",
  dateDuMatch: new Date(),
  dateReport: null
};
export const seniorTeam2Match: Match = {
  competition: "Régional 3",
  categorieEquipeLocale: "Libre / Senior",
  equipeLocale: "TEAM 2",
  dateDuMatch: new Date(),
  dateReport: null
};
export const u18Team1Match: Match = {
  competition: "Départemental 1 U18 Masculin",
  categorieEquipeLocale: "Libre / U19 - U18",
  equipeLocale: "TEAM 21",
  dateDuMatch: new Date(),
  dateReport: null
};
export const loisirTeam1Match: Match = {
  competition: "Départemental Loisirs",
  categorieEquipeLocale: "Foot Loisir / Foot Loisir",
  equipeLocale: "TEAM 1",
  dateDuMatch: new Date(),
  dateReport: null
};
export const enterpriseTeam1Match: Match = {
  competition: "Départemental 1 Entreprise",
  categorieEquipeLocale: "Foot Entreprise / Senior",
  equipeLocale: "TEAM 1",
  dateDuMatch: new Date(),
  dateReport: null
}

export const seniorPlayer: Sanction = {
  competition: 'Régional 1 Intersport',
  numeroPersonne: 1,
  nomPrenomPersonne: 'John Doe',
  libelleDecision: '1 match de suspension',
  dateDeffet: new Date(),
  libelleMotif: null,
  libelleSousCategorie: 'Libre / Senior',
  dateDeFin: null,
  nbreCartonsJaunes: 0,
  cartonRouge: 'Oui',
  sommeTotale: null
};
export const u18Player: Sanction = {
  competition: 'Départemental 1 U18 Masculin',
  numeroPersonne: 2,
  nomPrenomPersonne: 'Mickael Young',
  libelleDecision: '1 match de suspension',
  dateDeffet: new Date(),
  libelleMotif: null,
  libelleSousCategorie: 'Libre / U18 (- 18 Ans)',
  dateDeFin: null,
  nbreCartonsJaunes: 0,
  cartonRouge: 'Oui',
  sommeTotale: null
}
export const loisirPlayer: Sanction = {
  competition: 'Départemental Loisirs',
  numeroPersonne: 3,
  nomPrenomPersonne: 'Lindy Harding',
  libelleDecision: '1 match de suspension',
  dateDeffet: new Date(),
  libelleMotif: null,
  libelleSousCategorie: 'Foot Loisir / Foot Loisir',
  dateDeFin: null,
  nbreCartonsJaunes: 0,
  cartonRouge: 'Oui',
  sommeTotale: null
};
export const veteranSeniorPlayer: Sanction = {
  competition: 'Régional 1 Intersport',
  numeroPersonne: 4,
  nomPrenomPersonne: 'Alex Old',
  libelleDecision: '1 match de suspension',
  dateDeffet: new Date(),
  libelleMotif: null,
  libelleSousCategorie: 'Libre / Vétéran',
  dateDeFin: null,
  nbreCartonsJaunes: 0,
  cartonRouge: 'Oui',
  sommeTotale: null
};
export const veteranEnterprisePlayer: Sanction = {
  competition: 'Départemental 1 Entreprise',
  numeroPersonne: 5,
  nomPrenomPersonne: 'Noah Thorburn',
  libelleDecision: '1 match de suspension',
  dateDeffet: new Date(),
  libelleMotif: null,
  libelleSousCategorie: 'Foot Entreprise / Vétéran',
  dateDeFin: null,
  nbreCartonsJaunes: 0,
  cartonRouge: 'Oui',
  sommeTotale: null
};
export const enterprisePlayer: Sanction = {
  competition: 'Départemental 1 Entreprise',
  numeroPersonne: 6,
  nomPrenomPersonne: 'Kyle Christmas',
  libelleDecision: '1 match de suspension',
  dateDeffet: new Date(),
  libelleMotif: null,
  libelleSousCategorie: 'Foot Entreprise / Senior',
  dateDeFin: null,
  nbreCartonsJaunes: 0,
  cartonRouge: 'Oui',
  sommeTotale: null
}
