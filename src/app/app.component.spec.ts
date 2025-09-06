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
        reporteRejoue: "",
        dateReport: ""
      }
    ]);
  })

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(fixedToday);
    component.suspendedPlayersByCategory.set(new Map());
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
    expect(component.suspendedPlayersByCategory().size).toBe(1);
    const seniorSuspension = component.suspendedPlayersByCategory().get('Libre / Senior');
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
    expect(component.suspendedPlayersByCategory().size).toBe(1);
    const seniorSuspension = component.suspendedPlayersByCategory().get('Libre / Senior');
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
    expect(component.suspendedPlayersByCategory().size).toBe(1);
    const seniorSuspension = component.suspendedPlayersByCategory().get('Libre / Senior');
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
    expect(component.suspendedPlayersByCategory().size).toBe(1);
    const u19Suspension = component.suspendedPlayersByCategory().get('Libre / U19 - U18');
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
    expect(component.suspendedPlayersByCategory().size).toBe(1);
    const u19Suspension = component.suspendedPlayersByCategory().get('Libre / U19 - U18');
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
    expect(component.suspendedPlayersByCategory().size).toBe(0);
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
    expect(component.suspendedPlayersByCategory().size).toBe(0);
  })

  it('should display not same season error when sanction from past season without match', () => {
    component.sanctions.set([
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

    // WHEN
    component.sanctionAnalysis();

    // THEN
    const analysisErrors = component.errors().get("analysis")
    expect(analysisErrors?.length).toBe(1);
    expect(component.suspendedPlayersByCategory().size).toBe(0);
  })

  it('should display column error when missing required columns on sanctions or matches file', () => {
    const sanctionsInputColumns = ['Nom, prénom personne', 'Libellé décision', 'Libellé sous catégorie'];
    const matchesInputColumns = ['Compétition', 'Equipe locale', 'Date du match'];

    // WHEN
    component.checkColumns(sanctionsInputColumns, 'sanction');
    component.checkColumns(matchesInputColumns, 'match');

    // THEN
    const errors = component.errors();
    expect(errors.size).toBe(2);
    const sanctionErrors = errors.get('sanction');
    expect(sanctionErrors?.length).toBe(2);
    expect(sanctionErrors![0]).toBe('La colonne Compétition est manquante');
    expect(sanctionErrors![1]).toBe('La colonne Date d\'effet est manquante');
    const matchErrors = errors.get('match');
    expect(matchErrors?.length).toBe(1);
    expect(matchErrors![0]).toBe('La colonne Catégorie équipe locale est manquante');
    expect(component.suspendedPlayersByCategory().size).toBe(0);
  })
});
