import { CellHook, MarginPaddingInput, Styles } from 'jspdf-autotable';

export interface Sanction {
  competition: string,
  numeroPersonne: number,
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

export interface PlayerSuspensions {
  name: string,
  teams: TeamRemainingSuspension[]
}

export interface TeamRemainingSuspension {
  name: string,
  remaining: number
}

export interface TeamNameMatching {
  categorieFootclub: string
  nomEquipeFootclub: string
  nomEquipeInterne: string
}

export interface PdfOptions {
  title?: string,
  didParseCell?: CellHook,
  columnStyles?: { [p: string]: Partial<Styles> },
  margin?: MarginPaddingInput
}
