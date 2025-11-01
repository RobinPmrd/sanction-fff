import { NextWeekendSuspensionsComponent } from './next-weekend-suspensions.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { Match, PlayerSuspensions, Sanction, TeamNameMatching } from '../app.model';
import { setInput } from '../utils';
import {
  enterprisePlayer,
  enterpriseTeam1Match,
  loisirPlayer,
  loisirTeam1Match,
  seniorPlayer,
  seniorTeam1Match,
  seniorTeam2Match,
  u18Player,
  u18Team1Match,
  veteranEnterprisePlayer,
  veteranSeniorPlayer
} from '../app.component.spec';

describe('sanctionAnalysis() Tests', () => {
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
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-11') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const seniorPlayersSuspensions: PlayerSuspensions[] = [
      { name: seniorPlayer.nomPrenomPersonne, teams: [{ name: 'Sénior B', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.numeroPersonne], seniorPlayersSuspensions);
  });

  it('should be suspended for both team when 2 matches suspension ', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-16") },
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-11'), libelleDecision: '2 matchs de suspension' }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const seniorPlayersSuspensions: PlayerSuspensions[] = [
      { name: seniorPlayer.nomPrenomPersonne, teams: [{ name: 'Sénior A', remaining: 1 }, { name: 'Sénior B', remaining: 2 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.numeroPersonne], seniorPlayersSuspensions);
  });

  it('should ignore friendly matches and be suspended for both team first match when suspended from last season', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-08-09"), competition: "Matches Amicaux Seniors" },
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-05-20') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const seniorPlayersSuspensions: PlayerSuspensions[] = [
      { name: seniorPlayer.nomPrenomPersonne, teams: [{ name: 'Sénior A', remaining: 1 }, { name: 'Sénior B', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.numeroPersonne], seniorPlayersSuspensions);
  });

  it('should be suspended when young player ', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [u18Player.numeroPersonne, [{ ...u18Player, dateDeffet: new Date('2024-09-18') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const u18PlayersSuspensions: PlayerSuspensions[] = [
      { name: u18Player.nomPrenomPersonne, teams: [{ name: 'U18 A', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / U19 - U18',
      [u18Player.numeroPersonne], u18PlayersSuspensions);
  });

  it('should be suspended in young category when young player suspended in senior', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [u18Player.numeroPersonne, [{ ...u18Player, dateDeffet: new Date('2024-09-18'), competition: 'Régional 3' }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const u18PlayersSuspensions: PlayerSuspensions[] = [
      { name: u18Player.nomPrenomPersonne, teams: [{ name: 'U18 A', remaining: 1 }, { name: 'Sénior B', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / U19 - U18',
      [u18Player.numeroPersonne], u18PlayersSuspensions);
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
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [u18Player.numeroPersonne, [{ ...u18Player, dateDeffet: new Date('2024-09-06'), libelleDecision: 'Suspendu jusqu\'à réception de rapport et décision' }]],
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-06'), libelleDecision: 'Traité le 15/10/2025' }]],
      [veteranSeniorPlayer.numeroPersonne, [{ ...veteranSeniorPlayer, dateDeffet: null, libelleDecision: 'A traiter le 15/10/2025' }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const u18PlayersSuspensions: PlayerSuspensions[] = [
      { name: u18Player.nomPrenomPersonne, teams: [{ name: 'U18 A', remaining: 999 }, { name: 'Sénior A', remaining: 999 }, { name: 'Sénior B', remaining: 999 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 2, 'Libre / U19 - U18',
      [u18Player.numeroPersonne], u18PlayersSuspensions);
    const seniorPlayersSuspensions: PlayerSuspensions[] = [
      { name: seniorPlayer.nomPrenomPersonne, teams: [{ name: 'Sénior A', remaining: 999 }, { name: 'Sénior B', remaining: 999 }] },
      { name: veteranSeniorPlayer.nomPrenomPersonne, teams: [{ name: 'Sénior A', remaining: 999 }, { name: 'Sénior B', remaining: 999 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 2, 'Libre / Senior',
      [seniorPlayer.numeroPersonne, veteranSeniorPlayer.numeroPersonne], seniorPlayersSuspensions);
  });

  it('should be suspended for one match more when libelleSousCategorie contains Automatique', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-16") },
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-23") },
    ])
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [u18Player.numeroPersonne, [{ ...u18Player, dateDeffet: new Date('2024-09-06'), libelleDecision: 'Automatique + 3 Matchs De Suspension' }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const playersSuspensions: PlayerSuspensions[] = [
      { name: u18Player.nomPrenomPersonne, teams: [{ name: 'U18 A', remaining: 3 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / U19 - U18',
      [u18Player.numeroPersonne], playersSuspensions);
  });

  it('should be suspended when match report in the future', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-16"), dateReport: new Date("2024-12-15") },
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-11') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const playersSuspensions: PlayerSuspensions[] = [
      { name: seniorPlayer.nomPrenomPersonne, teams: [{ name: 'Sénior A', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.numeroPersonne], playersSuspensions);
  });

  it('should not be suspended', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-16") },
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-11') }]]
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
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [
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
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-11') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const seniorPlayersSuspensions: PlayerSuspensions[] = [
      { name: seniorPlayer.nomPrenomPersonne, teams: [{ name: 'Sénior A', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.numeroPersonne], seniorPlayersSuspensions);
  });

  it('should be suspended for Team 2 when effect date in the future and no match remaining', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-16") },
    ])
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-25') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const playersSuspensions: PlayerSuspensions[] = [
      { name: seniorPlayer.nomPrenomPersonne, teams: [{ name: 'Sénior B', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.numeroPersonne], playersSuspensions);
  });

  it('should be suspended when Loisir player', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...loisirTeam1Match, dateDuMatch: new Date("2024-09-23") }
    ]);
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [loisirPlayer.numeroPersonne, [{ ...loisirPlayer, dateDeffet: new Date('2024-09-18') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const playersSuspensions: PlayerSuspensions[] = [
      { name: loisirPlayer.nomPrenomPersonne, teams: [{ name: 'Loisir A', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Foot Loisir / Foot Loisir',
      [loisirPlayer.numeroPersonne], playersSuspensions);
  });

  it('should be suspended when Veteran player playing in Senior category', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ]);
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [veteranSeniorPlayer.numeroPersonne, [{ ...veteranSeniorPlayer, dateDeffet: new Date('2024-09-18') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const playersSuspensions: PlayerSuspensions[] = [
      { name: veteranSeniorPlayer.nomPrenomPersonne, teams: [{ name: 'Sénior A', remaining: 1 }, { name: 'Sénior B', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [veteranSeniorPlayer.numeroPersonne], playersSuspensions);
  });

  it('should be suspended when Entreprise player', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...enterpriseTeam1Match, dateDuMatch: new Date("2024-09-23") }
    ]);
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [veteranEnterprisePlayer.numeroPersonne, [{ ...veteranEnterprisePlayer, dateDeffet: new Date('2024-09-18') }]],
      [enterprisePlayer.numeroPersonne, [{ ...enterprisePlayer, dateDeffet: new Date('2024-09-21') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const playersSuspensions: PlayerSuspensions[] = [
      { name: veteranEnterprisePlayer.nomPrenomPersonne, teams: [{ name: 'Entreprise A', remaining: 1 }] },
      { name: enterprisePlayer.nomPrenomPersonne, teams: [{ name: 'Entreprise A', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Foot Entreprise / Senior',
      [veteranEnterprisePlayer.numeroPersonne, enterprisePlayer.numeroPersonne], playersSuspensions);
  });

  it('should be suspended when effect date greater than today but before week-end', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-22') }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const playersSuspensions: PlayerSuspensions[] = [
      { name: seniorPlayer.nomPrenomPersonne, teams: [{ name: 'Sénior A', remaining: 1 }, { name: 'Sénior B', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 1, 'Libre / Senior',
      [seniorPlayer.numeroPersonne], playersSuspensions);
  });

  it('should be suspended when 2 players with same name', () => {
    setInput<Match[]>(componentRef, 'matches', [
      { ...seniorTeam1Match, dateDuMatch: new Date("2024-09-23") },
      { ...seniorTeam2Match, dateDuMatch: new Date("2024-09-23") },
      { ...u18Team1Match, dateDuMatch: new Date("2024-09-23") }
    ])
    setInput<Map<number, Sanction[]>>(componentRef, 'sanctionsPerPlayer', new Map([
      [seniorPlayer.numeroPersonne, [{ ...seniorPlayer, dateDeffet: new Date('2024-09-22') }]],
      [u18Player.numeroPersonne, [{ ...u18Player, dateDeffet: new Date('2024-09-22'), nomPrenomPersonne: seniorPlayer.nomPrenomPersonne }]]
    ]));

    // WHEN
    nextWeekendSuspensionsComponent.sanctionAnalysis();

    // THEN
    const seniorPlayersSuspensions: PlayerSuspensions[] = [
      { name: seniorPlayer.nomPrenomPersonne, teams: [{ name: 'Sénior A', remaining: 1 }, { name: 'Sénior B', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 2, 'Libre / Senior',
      [seniorPlayer.numeroPersonne], seniorPlayersSuspensions);
    const u18PlayersSuspensions: PlayerSuspensions[] = [
      { name: seniorPlayer.nomPrenomPersonne, teams: [{ name: 'U18 A', remaining: 1 }, { name: 'Sénior A', remaining: 1 }, { name: 'Sénior B', remaining: 1 }] }
    ]
    checkSuspendedPlayersByCategory(nextWeekendSuspensionsComponent.suspendedPlayersByCategory(), 2, 'Libre / U19 - U18',
      [u18Player.numeroPersonne], u18PlayersSuspensions);

  });
});

describe("isPlayerTeam() Tests", () => {
  let nextWeekendSuspensionsComponent: NextWeekendSuspensionsComponent;
  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [NextWeekendSuspensionsComponent]
    });
    const fixture = TestBed.createComponent(NextWeekendSuspensionsComponent);
    nextWeekendSuspensionsComponent = fixture.componentInstance;
  })

  it('should be player\'s team when senior player and senior match', () => {
    expect(nextWeekendSuspensionsComponent.isPlayerTeam('Libre / Senior', seniorTeam1Match)).toBe(true);
  });

  it('should be player\'s team when U18 player and U18 match', () => {
    expect(nextWeekendSuspensionsComponent.isPlayerTeam('U18', u18Team1Match)).toBe(true);
  });

  it('should be player\'s team when U19 player and U19 match', () => {
    const match: Match = { ...u18Team1Match, competition: 'Régional 2 U19' };
    expect(nextWeekendSuspensionsComponent.isPlayerTeam('U19', match)).toBe(true);
  });

  it('should be player\'s team when U17 player and U18 match', () => {
    expect(nextWeekendSuspensionsComponent.isPlayerTeam('U17', u18Team1Match)).toBe(true);
  });

  it('should be player\'s team when U19 player and senior match', () => {
    expect(nextWeekendSuspensionsComponent.isPlayerTeam('U19', seniorTeam1Match)).toBe(true);
  });

  it('should not be player\'s team when U19 player and Gambardella match', () => {
    const match: Match = { ...u18Team1Match, competition: 'Coupe Gambardella Crédit Agricole / Régionale' };
    expect(nextWeekendSuspensionsComponent.isPlayerTeam('U19', match)).toBe(false);
  });

  it('should not be player\'s team when U15 player and U18 match', () => {
    expect(nextWeekendSuspensionsComponent.isPlayerTeam('U15', u18Team1Match)).toBe(false);
  });

  it('should be player\'s team when U18 player and Gambardella match', () => {
    const match: Match = { ...u18Team1Match, competition: 'Coupe Gambardella Crédit Agricole / Régionale' };
    expect(nextWeekendSuspensionsComponent.isPlayerTeam('U18', match)).toBe(true);
  });
})

function checkSuspendedPlayersByCategory(
  suspendedPlayersByCategory: Map<string, Map<number, PlayerSuspensions>>, categoryWithSuspensions: number, category: string,
  suspendedPlayers: number[], playersSuspensions: Array<PlayerSuspensions>
) {
  expect(suspendedPlayersByCategory.size).toBe(categoryWithSuspensions);
  const categorySuspensions = suspendedPlayersByCategory.get(category);
  expect(categorySuspensions?.size).toBe(suspendedPlayers.length);
  suspendedPlayers.forEach((player, index) => {
    const playerSuspensions = categorySuspensions?.get(player);
    const expectedPlayerSuspensions = playersSuspensions[index];
    expect(playerSuspensions).toEqual(expectedPlayerSuspensions);
  })
}
