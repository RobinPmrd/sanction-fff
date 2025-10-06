export interface Sanction {
  competition: string,
  numeroPersonne: number,
  nomPrenomPersonne: string,
  dateDeffet: Date,
  dateDeFin: Date | null,
  libelleDecision: string,
  libelleMotif: string | null,
  libelleSousCategorie: string,
  nbreCartonsJaunes: number | null,
  cartonRouge: 'Oui' | 'Non'
  sommeTotale: number | null
}

export interface Match {
  competition: string
  nomAbrege: string,
  numeroPhase: number,
  numeroDeJournee: number,
  numeroDeTour: number | null,
  numeroMatch: number,
  categorieEquipeLocale: string,
  equipeLocale: string,
  dateDuMatch: Date,
  dateReport: Date | null
}

export interface TeamSuspension {
  name: string,
  remaining: number
}
