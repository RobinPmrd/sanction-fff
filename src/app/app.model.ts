export interface Sanction {
  competition: string,
  numeroPersonne: number,
  nomPrenomPersonne: string,
  dateDeffet: Date,
  dateDeFin: Date | string,
  libelleDecision: string,
  libelleSousCategorie: string,
  nbreCartonsJaunes: number,
  cartonRouge: 'Oui' | 'Non'
}

export interface Match {
  competition: string
  nomAbrege: string,
  numeroPhase: number,
  numeroDeJournee: number,
  numeroDeTour: number | string,
  numeroMatch: number,
  categorieEquipeLocale: string,
  equipeLocale: string,
  dateDuMatch: Date,
  reporteRejoue: string,
  dateReport: Date | string
}

export interface TeamSuspension {
  name: string,
  remaining: number
}
