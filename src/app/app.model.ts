export interface Sanction {
  competition: string,
  nomPrenomPersonne: string,
  dateDeffet: Date | null,
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
  categorieEquipeLocale: string,
  equipeLocale: string,
  dateDuMatch: Date,
  dateReport: Date | null
}

export interface TeamSuspension {
  name: string,
  remaining: number
}

export interface TeamNameMatching {
  categorieFootclub: string
  nomEquipeFootclub: string
  nomEquipeInterne: string
}
