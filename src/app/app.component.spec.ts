import { AppComponent } from './app.component';

describe('AppComponent.sanctionAnalysis', () => {
  let component: AppComponent;
  const fixedToday = new Date('2024-09-21');

  beforeAll(() => {
    component = new AppComponent();
    component.matches.set([
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
        reporteRejoue: "",
        dateReport: ""
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
        reporteRejoue: "",
        dateReport: ""
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
        reporteRejoue: "",
        dateReport: ""
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
        reporteRejoue: "",
        dateReport: ""
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
        reporteRejoue: "",
        dateReport: ""
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
        reporteRejoue: "",
        dateReport: ""
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
        reporteRejoue: "",
        dateReport: ""
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
        reporteRejoue: "",
        dateReport: ""
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
        reporteRejoue: "",
        dateReport: ""
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
        reporteRejoue: "",
        dateReport: ""
      }
    ]);
  })

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(fixedToday);
    component.suspendedPlayersByCategory = new Map();
  });

  it('should be suspended only for team 2', () => {
    component.sanctions.set([
      {
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: '1 match de suspension',
        dateDeffet: new Date('2024-09-11'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: "",
        nbreCartonsJaunes: 0,
        cartonRouge: 'Oui'
      }
    ]);

    // WHEN
    component.sanctionAnalysis();

    // THEN
    expect(component.suspendedPlayersByCategory.size).toBe(1);
    const seniorSuspension = component.suspendedPlayersByCategory.get('Libre / Senior');
    expect(seniorSuspension?.size).toBe(1);
    const johnDoesSuspension = seniorSuspension?.get('John Doe');
    expect(johnDoesSuspension?.length).toBe(1);
    expect(johnDoesSuspension).toEqual([
      {
        name: 'TEAM 2',
        remaining: 1
      }
    ]);
  });

  it('should be suspended for both team when 2 matches suspension ', () => {
    component.sanctions.set([
      {
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: '2 matchs de suspension',
        dateDeffet: new Date('2024-09-11'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: "",
        nbreCartonsJaunes: 0,
        cartonRouge: 'Oui'
      }
    ]);

    // WHEN
    component.sanctionAnalysis();

    // THEN
    expect(component.suspendedPlayersByCategory.size).toBe(1);
    const seniorSuspension = component.suspendedPlayersByCategory.get('Libre / Senior');
    expect(seniorSuspension?.size).toBe(1);
    const johnDoesSuspension = seniorSuspension?.get('John Doe');
    expect(johnDoesSuspension?.length).toBe(2);
    expect(johnDoesSuspension).toEqual([
      {
        name: 'TEAM 1',
        remaining: 1
      },
      {
        name: 'TEAM 2',
        remaining: 2
      }
    ]);
  });

  it('should ignore friendly matches and be suspended for both team first match when suspended from last season', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-09-06'));
    component.sanctions.set([
      {
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: '1 matchs de suspension',
        dateDeffet: new Date('2024-05-20'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: "",
        nbreCartonsJaunes: 0,
        cartonRouge: 'Oui'
      }
    ]);

    // WHEN
    component.sanctionAnalysis();

    // THEN
    expect(component.suspendedPlayersByCategory.size).toBe(1);
    const seniorSuspension = component.suspendedPlayersByCategory.get('Libre / Senior');
    expect(seniorSuspension?.size).toBe(1);
    const johnDoesSuspension = seniorSuspension?.get('John Doe');
    expect(johnDoesSuspension?.length).toBe(2);
    expect(johnDoesSuspension).toEqual([
      {
        name: 'TEAM 1',
        remaining: 1
      },
      {
        name: 'TEAM 2',
        remaining: 1
      }
    ]);
  });

  it('should be suspended when young player ', () => {
    component.sanctions.set([
      {
        competition: 'Départemental 1 U18 Masculin',
        nomPrenomPersonne: 'Mickael Young',
        libelleDecision: '1 Match De Suspension Ferme (3ème avertissement)',
        dateDeffet: new Date('2024-09-18'),
        libelleSousCategorie: 'Libre / U18 (- 18 Ans)',
        numeroPersonne: 2,
        dateDeFin: "",
        nbreCartonsJaunes: 1,
        cartonRouge: 'Non'
      }
    ]);

    // WHEN
    component.sanctionAnalysis();

    // THEN
    expect(component.suspendedPlayersByCategory.size).toBe(1);
    const u19Suspension = component.suspendedPlayersByCategory.get('Libre / U19 - U18');
    expect(u19Suspension?.size).toBe(1);
    const mickaelYoungSuspension = u19Suspension?.get('Mickael Young');
    expect(mickaelYoungSuspension?.length).toBe(1);
    expect(mickaelYoungSuspension).toEqual([
      {
        name: 'TEAM 21',
        remaining: 1
      }
    ]);
  });

  it('should be suspended when suspended indefinitely ', () => {
    component.sanctions.set([
      {
        competition: 'Départemental 1 U18 Masculin',
        nomPrenomPersonne: 'Mickael Young',
        libelleDecision: 'Suspendu jusqu\'à réception de rapport et décision',
        dateDeffet: new Date('2024-09-06'),
        libelleSousCategorie: 'Libre / U18 (- 18 Ans)',
        numeroPersonne: 2,
        dateDeFin: "",
        nbreCartonsJaunes: 1,
        cartonRouge: 'Non'
      }
    ]);

    // WHEN
    component.sanctionAnalysis();

    // THEN
    expect(component.suspendedPlayersByCategory.size).toBe(1);
    const u19Suspension = component.suspendedPlayersByCategory.get('Libre / U19 - U18');
    expect(u19Suspension?.size).toBe(1);
    const mickaelYoungSuspension = u19Suspension?.get('Mickael Young');
    expect(mickaelYoungSuspension?.length).toBe(1);
    expect(mickaelYoungSuspension).toEqual([
      {
        name: 'TEAM 21',
        remaining: 999
      }
    ]);
  });

  it('should not be suspended', () => {
    component.sanctions.set([
      {
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: '1 match de suspension',
        dateDeffet: new Date('2024-09-04'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: "",
        nbreCartonsJaunes: 0,
        cartonRouge: 'Oui'
      }
    ]);

    // WHEN
    component.sanctionAnalysis();

    // THEN
    expect(component.suspendedPlayersByCategory.size).toBe(0);
  })

  it('should not be suspended when Inscription Au Fichier', () => {
    component.sanctions.set([
      {
        competition: 'Régional 1 Intersport',
        nomPrenomPersonne: 'John Doe',
        libelleDecision: 'Inscription Au Fichier',
        dateDeffet: new Date('2024-09-18'),
        libelleSousCategorie: 'Libre / Senior',
        numeroPersonne: 1,
        dateDeFin: new Date('2024-12-18'),
        nbreCartonsJaunes: 1,
        cartonRouge: 'Non'
      }
    ]);

    // WHEN
    component.sanctionAnalysis();

    // THEN
    expect(component.suspendedPlayersByCategory.size).toBe(0);
  })
});
