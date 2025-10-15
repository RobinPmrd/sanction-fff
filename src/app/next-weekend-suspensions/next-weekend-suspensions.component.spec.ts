import { NextWeekendSuspensionsComponent } from './next-weekend-suspensions.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';

describe('NextWeekendSuspensionsComponent.sanctionAnalysis', () => {
  let nextWeekendSuspensionsComponent: NextWeekendSuspensionsComponent;
  const fixedToday = new Date('2024-09-21');
  let fixture: ComponentFixture<NextWeekendSuspensionsComponent>;
  let componentRef: ComponentRef<NextWeekendSuspensionsComponent>;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [NextWeekendSuspensionsComponent]
    });
    fixture = TestBed.createComponent(NextWeekendSuspensionsComponent);
    nextWeekendSuspensionsComponent = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('matches', [
      {
        nomAbrege: "MASL",
        competition: "Matches Amicaux Seniors",
        numeroPhase: 1,
        numeroDeJournee: 2,
        numeroDeTour: "",
        numeroMatch: 1,
        categorieEquipeLocale: "Libre / Senior",
        equipeLocale: "TEAM 1",
        dateDuMatch: new Date("2024-08-09"),
        dateReport: null
      },
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
        dateReport: null
      },
      {
        nomAbrege: "REG 1",
        competition: "Régional 1 Intersport",
        numeroPhase: 1,
        numeroDeJournee: 2,
        numeroDeTour: "",
        numeroMatch: 3,
        categorieEquipeLocale: "Libre / Senior",
        equipeLocale: "TEAM 1",
        dateDuMatch: new Date("2024-09-16"),
        dateReport: null
      },
      {
        nomAbrege: "REG 1",
        competition: "Régional 1 Intersport",
        numeroPhase: 1,
        numeroDeJournee: 3,
        numeroDeTour: "",
        numeroMatch: 4,
        categorieEquipeLocale: "Libre / Senior",
        equipeLocale: "TEAM 1",
        dateDuMatch: new Date("2024-09-23"),
        dateReport: null
      },
      {
        nomAbrege: "REG 1",
        competition: "Régional 1 Intersport",
        numeroPhase: 1,
        numeroDeJournee: 1,
        numeroDeTour: "",
        numeroMatch: 2,
        categorieEquipeLocale: "Libre / Senior",
        equipeLocale: "TEAM 1",
        dateDuMatch: new Date("2024-09-29"),
        dateReport: new Date("2024-12-15")
      },
      {
        nomAbrege: "REG 3",
        competition: "Régional 3",
        numeroPhase: 1,
        numeroDeJournee: 1,
        numeroDeTour: "",
        numeroMatch: 5,
        categorieEquipeLocale: "Libre / Senior",
        equipeLocale: "TEAM 2",
        dateDuMatch: new Date("2024-09-07"),
        dateReport: null
      },
      {
        nomAbrege: "REG 3",
        competition: "Régional 3",
        numeroPhase: 1,
        numeroDeJournee: 2,
        numeroDeTour: "",
        numeroMatch: 6,
        categorieEquipeLocale: "Libre / Senior",
        equipeLocale: "TEAM 2",
        dateDuMatch: new Date("2024-09-23"),
        dateReport: null
      },
      {
        nomAbrege: "REG 3",
        competition: "Régional 3",
        numeroPhase: 1,
        numeroDeJournee: 2,
        numeroDeTour: "",
        numeroMatch: 6,
        categorieEquipeLocale: "Libre / Senior",
        equipeLocale: "TEAM 2",
        dateDuMatch: new Date("2024-10-20"),
        dateReport: new Date("2024-10-13")
      },
      {
        nomAbrege: "MASL",
        competition: "Matches Amicaux Seniors",
        numeroPhase: 1,
        numeroDeJournee: 2,
        numeroDeTour: "",
        numeroMatch: 7,
        categorieEquipeLocale: "Libre / Senior",
        equipeLocale: "TEAM 2",
        dateDuMatch: new Date("2024-08-09"),
        dateReport: null
      },
      {
        nomAbrege: "U18D1M",
        competition: "Départemental 1 U18 Masculin",
        numeroPhase: 1,
        numeroDeJournee: 1,
        numeroDeTour: "",
        numeroMatch: 7,
        categorieEquipeLocale: "Libre / U19 - U18",
        equipeLocale: "TEAM 21",
        dateDuMatch: new Date("2024-09-16"),
        dateReport: null
      },
      {
        nomAbrege: "U18D1M",
        competition: "Départemental 1 U18 Masculin",
        numeroPhase: 1,
        numeroDeJournee: 2,
        numeroDeTour: "",
        numeroMatch: 8,
        categorieEquipeLocale: "Libre / U19 - U18",
        equipeLocale: "TEAM 21",
        dateDuMatch: new Date("2024-09-23"),
        dateReport: null
      },
      {
        nomAbrege: "U18D1M",
        competition: "Départemental 1 U18 Masculin",
        numeroPhase: 1,
        numeroDeJournee: 3,
        numeroDeTour: "",
        numeroMatch: 8,
        categorieEquipeLocale: "Libre / U19 - U18",
        equipeLocale: "TEAM 21",
        dateDuMatch: new Date("2024-09-30"),
        dateReport: null
      },
      {
        nomAbrege: "REG 1",
        competition: "Régional 1 Intersport",
        numeroPhase: 1,
        numeroDeJournee: 1,
        numeroDeTour: "",
        numeroMatch: 2,
        categorieEquipeLocale: "Libre / Senior",
        equipeLocale: "TEAM 1",
        dateDuMatch: new Date("2024-05-18"),
        dateReport: null
      }
    ]);
    componentRef.setInput('teamNameMatchings', [
      {
        categorieFootclub: 'Libre / Senior',
        nomEquipeFootclub: 'TEAM 1',
        nomEquipeInterne: 'Sénior A'
      },
      {
        categorieFootclub: 'Libre / Senior',
        nomEquipeFootclub: 'TEAM 2',
        nomEquipeInterne: 'Sénior B'
      },
      {
        categorieFootclub: 'Libre / U19 - U18',
        nomEquipeFootclub: 'TEAM 21',
        nomEquipeInterne: 'U18 A'
      },
    ])
  })

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(fixedToday);
    nextWeekendSuspensionsComponent.suspendedPlayersByCategory.set(new Map());
  });

  it('should be suspended only for team 2', () => {
    componentRef.setInput('sanctionPerPlayer', new Map([
      ['John Doe', [{
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: '1 match de suspension',
        dateDeffet: new Date('2024-09-11'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: "",
        nbreCartonsJaunes: 0,
        cartonRouge: 'Oui'
      }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(1);
    const seniorSuspension = nextWeekendSuspensionsComponent.suspendedPlayersByCategory().get('Libre / Senior');
    expect(seniorSuspension?.size).toBe(1);
    const johnDoesSuspension = seniorSuspension?.get('John Doe');
    expect(johnDoesSuspension?.length).toBe(1);
    expect(johnDoesSuspension).toEqual([
      {
        name: 'Sénior B',
        remaining: 1
      }
    ]);
  });

  it('should be suspended for both team when 2 matches suspension ', () => {
    componentRef.setInput('sanctionPerPlayer', new Map([
      ['John Doe', [{
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: '2 matchs de suspension',
        dateDeffet: new Date('2024-09-11'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: null,
        nbreCartonsJaunes: 0,
        cartonRouge: 'Oui'
      }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(1);
    const seniorSuspension = nextWeekendSuspensionsComponent.suspendedPlayersByCategory().get('Libre / Senior');
    expect(seniorSuspension?.size).toBe(1);
    const johnDoesSuspension = seniorSuspension?.get('John Doe');
    expect(johnDoesSuspension?.length).toBe(2);
    expect(johnDoesSuspension).toEqual([
      {
        name: 'Sénior A',
        remaining: 1
      },
      {
        name: 'Sénior B',
        remaining: 2
      }
    ]);
  });

  it('should ignore friendly matches and be suspended for both team first match when suspended from last season', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-09-06'));
    componentRef.setInput('sanctionPerPlayer', new Map([
      ['John Doe', [{
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: '1 matchs de suspension',
        dateDeffet: new Date('2024-05-20'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: "",
        nbreCartonsJaunes: 0,
        cartonRouge: 'Oui'
      }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(1);
    const seniorSuspension = nextWeekendSuspensionsComponent.suspendedPlayersByCategory().get('Libre / Senior');
    expect(seniorSuspension?.size).toBe(1);
    const johnDoesSuspension = seniorSuspension?.get('John Doe');
    expect(johnDoesSuspension?.length).toBe(2);
    expect(johnDoesSuspension).toEqual([
      {
        name: 'Sénior A',
        remaining: 1
      },
      {
        name: 'Sénior B',
        remaining: 1
      }
    ]);
  });

  it('should be suspended when young player ', () => {
    componentRef.setInput('sanctionPerPlayer', new Map([
      ['Mickael Young', [{
        competition: 'Départemental 1 U18 Masculin',
        nomPrenomPersonne: 'Mickael Young',
        libelleDecision: '1 Match De Suspension Ferme (3ème avertissement)',
        dateDeffet: new Date('2024-09-18'),
        libelleSousCategorie: 'Libre / U18 (- 18 Ans)',
        numeroPersonne: 2,
        dateDeFin: "",
        nbreCartonsJaunes: 1,
        cartonRouge: 'Non'
      }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(1);
    const u19Suspension = nextWeekendSuspensionsComponent.suspendedPlayersByCategory().get('Libre / U19 - U18');
    expect(u19Suspension?.size).toBe(1);
    const mickaelYoungSuspension = u19Suspension?.get('Mickael Young');
    expect(mickaelYoungSuspension?.length).toBe(1);
    expect(mickaelYoungSuspension).toEqual([
      {
        name: 'U18 A',
        remaining: 1
      }
    ]);
  });

  it('should be suspended when suspended indefinitely ', () => {
    componentRef.setInput('sanctionPerPlayer', new Map([
      ['Mickael Young', [{
        competition: 'Départemental 1 U18 Masculin',
        nomPrenomPersonne: 'Mickael Young',
        libelleDecision: 'Suspendu jusqu\'à réception de rapport et décision',
        dateDeffet: new Date('2024-09-06'),
        libelleSousCategorie: 'Libre / U18 (- 18 Ans)',
        numeroPersonne: 2,
        dateDeFin: "",
        nbreCartonsJaunes: 1,
        cartonRouge: 'Non'
      }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(1);
    const u19Suspension = nextWeekendSuspensionsComponent.suspendedPlayersByCategory().get('Libre / U19 - U18');
    expect(u19Suspension?.size).toBe(1);
    const mickaelYoungSuspension = u19Suspension?.get('Mickael Young');
    expect(mickaelYoungSuspension?.length).toBe(1);
    expect(mickaelYoungSuspension).toEqual([
      {
        name: 'U18 A',
        remaining: 999
      }
    ]);
  });

  it('should be suspended for one match more when libelleSousCategorie contains Automatique', () => {
    componentRef.setInput('sanctionPerPlayer', new Map([
      ['Mickael Young', [{
        competition: 'Départemental 1 U18 Masculin',
        nomPrenomPersonne: 'Mickael Young',
        libelleDecision: 'Automatique + 3 Matchs De Suspension',
        dateDeffet: new Date('2024-09-06'),
        libelleSousCategorie: 'Libre / U18 (- 18 Ans)',
        numeroPersonne: 2,
        dateDeFin: "",
        nbreCartonsJaunes: 1,
        cartonRouge: 'Non'
      }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(1);
    const u19Suspension = nextWeekendSuspensionsComponent.suspendedPlayersByCategory().get('Libre / U19 - U18');
    expect(u19Suspension?.size).toBe(1);
    const mickaelYoungSuspension = u19Suspension?.get('Mickael Young');
    expect(mickaelYoungSuspension?.length).toBe(1);
    expect(mickaelYoungSuspension).toEqual([
      {
        name: 'U18 A',
        remaining: 3
      }
    ]);
  });

  it('should be suspended when match report in the future', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-09-30'));
    componentRef.setInput('sanctionPerPlayer', new Map([
      ['John Doe', [{
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: '1 matchs de suspension',
        dateDeffet: new Date('2024-09-24'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: "",
        nbreCartonsJaunes: 0,
        cartonRouge: 'Oui'
      }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(1);
    const seniorSuspension = nextWeekendSuspensionsComponent.suspendedPlayersByCategory().get('Libre / Senior');
    expect(seniorSuspension?.size).toBe(1);
    const johnDoeSuspension = seniorSuspension?.get('John Doe');
    expect(johnDoeSuspension?.length).toBe(2);
    expect(johnDoeSuspension).toEqual([
      {
        name: 'Sénior A',
        remaining: 1
      },
      {
        name: 'Sénior B',
        remaining: 1
      },
    ]);
  });

  it('should not be suspended', () => {
    componentRef.setInput('sanctionPerPlayer', new Map([
      ['John Doe', [{
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: '1 match de suspension',
        dateDeffet: new Date('2024-09-04'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: "",
        nbreCartonsJaunes: 0,
        cartonRouge: 'Oui'
      }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(0);
  })

  it('should not be suspended when Inscription Au Fichier', () => {
    componentRef.setInput('sanctionPerPlayer', new Map([
      ['John Doe', [{
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: 'Inscription Au Fichier',
        dateDeffet: new Date('2024-09-18'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: new Date('2024-12-18'),
        nbreCartonsJaunes: 1,
        cartonRouge: 'Non'
      }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(0);
  })

  it('should not be suspended with Team 2 when match report in advance', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-10-14'));
    componentRef.setInput('sanctionPerPlayer', new Map([
      ['John Doe', [{
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: '1 matchs de suspension',
        dateDeffet: new Date('2024-10-07'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: "",
        nbreCartonsJaunes: 0,
        cartonRouge: 'Oui'
      }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(1);
    const seniorSuspension = nextWeekendSuspensionsComponent.suspendedPlayersByCategory().get('Libre / Senior');
    expect(seniorSuspension?.size).toBe(1);
    const johnDoeSuspension = seniorSuspension?.get('John Doe');
    expect(johnDoeSuspension?.length).toBe(1);
    expect(johnDoeSuspension).toEqual([
      {
        name: 'Sénior A',
        remaining: 1
      }
    ]);
  });

  it('should not be suspended with Team 2 when effect date in the future', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-10-11'));
    componentRef.setInput('sanctionPerPlayer', new Map([
      ['John Doe', [{
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: '1 matchs de suspension',
        dateDeffet: new Date('2024-10-14'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: "",
        nbreCartonsJaunes: 0,
        cartonRouge: 'Oui'
      }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(0);
  });
});
