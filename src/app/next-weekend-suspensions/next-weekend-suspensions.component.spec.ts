import { NextWeekendSuspensionsComponent } from './next-weekend-suspensions.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { Match, Sanction, TeamNameMatching, TeamSuspension } from '../app.model';
import { setInput } from '../utils';

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
    setInput<TeamNameMatching[]>(componentRef, 'teamNameMatchings', [
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
      {
        categorieFootclub: 'Foot Loisir / Foot Loisir',
        nomEquipeFootclub: 'TEAM 1',
        nomEquipeInterne: 'Loisir A'
      },
      {
        categorieFootclub: 'Foot Entreprise / Senior',
        nomEquipeFootclub: 'TEAM 1',
        nomEquipeInterne: 'Entreprise A'
      },
    ])
  })

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(fixedToday);
    nextWeekendSuspensionsComponent.suspendedPlayersByCategory.set(new Map());
  });

  it('should be suspended only for team 2', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-16") },
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [seniorPlayer.nomPrenomPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-11') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'Sénior B', remaining: 1 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should be suspended for both team when 2 matches suspension ', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-16") },
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [seniorPlayer.nomPrenomPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-11'), libelleDecision: '2 matchs de suspension' }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'Sénior A', remaining: 1 }, { name: 'Sénior B', remaining: 2 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should ignore friendly matches and be suspended for both team first match when suspended from last season', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-08-09"), competition: "Matches Amicaux Seniors" },
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [seniorPlayer.nomPrenomPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-05-20') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'Sénior A', remaining: 1 }, { name: 'Sénior B', remaining: 1 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should be suspended when young player ', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [u18Player.nomPrenomPersonne, [{ ...u18Player, dateDeffet: new Date('2024-09-18') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'U18 A', remaining: 1 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / U19 - U18',
      [u18Player.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should be suspended in young category when young player suspended in senior', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [u18Player.nomPrenomPersonne, [{ ...u18Player, dateDeffet: new Date('2024-09-18'), competition: 'Régional 3' }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'U18 A', remaining: 1 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / U19 - U18',
      [u18Player.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should be suspended when suspended indefinitely ', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-09") },
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-16") },
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-09") },
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-16") },
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [u18Player.nomPrenomPersonne, [{ ...u18Player, dateDeffet: new Date('2024-09-06'), libelleDecision: 'Suspendu jusqu\'à réception de rapport et décision' }]],
      [seniorPlayer.nomPrenomPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-06'), libelleDecision: 'Traité le 15/10/2025' }]],
      [veteranSeniorPlayer.nomPrenomPersonne, [{ ...veteranSeniorPlayer, dateDeffet: null, libelleDecision: 'A traiter le 15/10/2025' }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedU18TeamSuspensions = [
      [{ name: 'U18 A', remaining: 999 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 2, 'Libre / U19 - U18',
      [u18Player.nomPrenomPersonne], expectedU18TeamSuspensions);
    const expectedSeniorTeamSuspensions = [
      [{ name: 'Sénior A', remaining: 999 }, { name: 'Sénior B', remaining: 999 }],
      [{ name: 'Sénior A', remaining: 999 }, { name: 'Sénior B', remaining: 999 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 2, 'Libre / Senior',
      [seniorPlayer.nomPrenomPersonne, veteranSeniorPlayer.nomPrenomPersonne], expectedSeniorTeamSuspensions);
  });

  it('should be suspended for one match more when libelleSousCategorie contains Automatique', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-16") },
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-23") },
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [u18Player.nomPrenomPersonne, [{ ...u18Player, dateDeffet: new Date('2024-09-06'), libelleDecision: 'Automatique + 3 Matchs De Suspension' }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'U18 A', remaining: 3 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / U19 - U18',
      [u18Player.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should be suspended when match report in the future', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-16"), dateReport: new Date("2024-12-15") },
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [seniorPlayer.nomPrenomPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-11') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'Sénior A', remaining: 1 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should not be suspended', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-16") },
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [seniorPlayer.nomPrenomPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-11') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(0);
  })

  it('should not be suspended when Inscription Au Fichier', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [seniorPlayer.nomPrenomPersonne, [
        {
          ...seniorPlayer,
          dateDeffet: new Date('2024-09-18'), libelleDecision: 'Inscription Au Fichier', dateDeFin: new Date('2024-12-18'), nbreCartonsJaunes: 1, cartonRouge: 'Non'
        }]
      ]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    expect(nextWeekendSuspensionsComponent.suspendedPlayersByCategory().size).toBe(0);
  })

  it('should not be suspended with Team 2 when match report in advance', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-12-16"), dateReport: new Date("2024-09-16") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [seniorPlayer.nomPrenomPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-11') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'Sénior A', remaining: 1 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should be suspended for Team 2 when effect date in the future and no match remaining', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-16") },
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [seniorPlayer.nomPrenomPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-25') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'Sénior B', remaining: 1 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should be suspended when Loisir player', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...loisirTeam1Match, dateDuMatch: new Date("2024-09-23") }
    ]);
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [loisirPlayer.nomPrenomPersonne, [{ ...loisirPlayer, dateDeffet: new Date('2024-09-18') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'Loisir A', remaining: 1 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Foot Loisir / Foot Loisir',
      [loisirPlayer.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should be suspended when Veteran player playing in Senior category', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ]);
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [veteranSeniorPlayer.nomPrenomPersonne, [{ ...veteranSeniorPlayer, dateDeffet: new Date('2024-09-18') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'Sénior A', remaining: 1 }, { name: 'Sénior B', remaining: 1 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [veteranSeniorPlayer.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should be suspended when Entreprise player', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...enterpriseTeam1Match, dateDuMatch: new Date("2024-09-23") }
    ]);
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [veteranEnterprisePlayer.nomPrenomPersonne, [{ ...veteranEnterprisePlayer, dateDeffet: new Date('2024-09-18') }]],
      [enterprisePlayer.nomPrenomPersonne, [{ ...enterprisePlayer, dateDeffet: new Date('2024-09-21') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'Entreprise A', remaining: 1 }],
      [{ name: 'Entreprise A', remaining: 1 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Foot Entreprise / Senior',
      [veteranEnterprisePlayer.nomPrenomPersonne, enterprisePlayer.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should be suspended when effect date greater than today but before week-end', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [seniorPlayer.nomPrenomPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-22') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'Sénior A', remaining: 1 }, { name: 'Sénior B', remaining: 1 }],
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.nomPrenomPersonne], expectedTeamSuspensions);
  });

  it('should be suspended when 2 players with same name', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") },
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<string, Sanction[]>>(componentRef, 'sanctionPerPlayer', new Map([
      [seniorPlayer.nomPrenomPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-22') }]],
      [seniorPlayer.nomPrenomPersonne, [{ ...u18Player, dateDeffet: new Date('2024-09-22'), nomPrenomPersonne: seniorPlayer.nomPrenomPersonne }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const expectedTeamSuspensions = [
      [{ name: 'Sénior A', remaining: 1 }, { name: 'Sénior B', remaining: 1 }],
      [{ name: 'U18 A', remaining: 1 }]
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 2, 'Libre / Senior',
      [seniorPlayer.nomPrenomPersonne, seniorPlayer.nomPrenomPersonne], expectedTeamSuspensions);
  });
});

function checkSuspendedPlayersByCategory(
  suspendedPlayersByCategory: Map<string, Map<string, TeamSuspension[]>>, categoryWithSuspensions: number, category: string,
  suspendedPlayers: string[], suspendedPlayerTeams: Array<TeamSuspension[]>
) {
  expect(suspendedPlayersByCategory.size).toBe(categoryWithSuspensions);
  const categorySuspensions = suspendedPlayersByCategory.get(category);
  expect(categorySuspensions?.size).toBe(suspendedPlayers.length);
  suspendedPlayers.forEach((player, index) => {
    const playerSuspensions = categorySuspensions?.get(player);
    const teamSuspensions = suspendedPlayerTeams[index];
    expect(playerSuspensions).toEqual(teamSuspensions);
  })
}

const seniorTeam1Match: Match = {
  competition: "Régional 1 Intersport",
  categorieEquipeLocale: "Libre / Senior",
  equipeLocale: "TEAM 1",
  dateDuMatch: new Date(),
  dateReport: null
};
const seniorTeam2Match: Match = {
  competition: "Régional 3",
  categorieEquipeLocale: "Libre / Senior",
  equipeLocale: "TEAM 2",
  dateDuMatch: new Date(),
  dateReport: null
};
const u18Team1Match: Match = {
  competition: "Départemental 1 U18 Masculin",
  categorieEquipeLocale: "Libre / U19 - U18",
  equipeLocale: "TEAM 21",
  dateDuMatch: new Date(),
  dateReport: null
};
const loisirTeam1Match: Match = {
  competition: "Départemental Loisirs",
  categorieEquipeLocale: "Foot Loisir / Foot Loisir",
  equipeLocale: "TEAM 1",
  dateDuMatch: new Date(),
  dateReport: null
};
const enterpriseTeam1Match: Match = {
  competition: "Départemental 1 Entreprise",
  categorieEquipeLocale: "Foot Entreprise / Senior",
  equipeLocale: "TEAM 1",
  dateDuMatch: new Date(),
  dateReport: null
}

const seniorPlayer: Sanction = {
  competition: 'Régional 1 Intersport',
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
const u18Player: Sanction = {
  competition: 'Départemental 1 U18 Masculin',
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
const loisirPlayer: Sanction = {
  competition: 'Départemental Loisirs',
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
const veteranSeniorPlayer: Sanction = {
  competition: 'Régional 1 Intersport',
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
const veteranEnterprisePlayer: Sanction = {
  competition: 'Départemental 1 Entreprise',
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
const enterprisePlayer: Sanction = {
  competition: 'Départemental 1 Entreprise',
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
