import type { ConversionRule } from '../engine/types'

export type InstitutionType =
  | 'IIT'
  | 'NIT'
  | 'IIIT'
  | 'Central University'
  | 'State University'
  | 'Deemed University'
  | 'Private University'
  | 'Autonomous College'
  | 'Affiliated College'

export interface Institution {
  id: string // slug, used in URLs e.g. /universities/makaut
  name: string
  shortName?: string // e.g. "MAKAUT"
  aliases: string[] // additional search terms, e.g. former names ("WBUT")
  type: InstitutionType
  city: string
  state: string
  programmes: string[] // e.g. ["BTech", "MTech", "BCA", "MCA"]
  scaleMax: number // dominant grading scale, e.g. 10
  gradingScaleDescription: string
  website?: string
  hasOfficialConversion: boolean
  notes?: string
}

export interface InstitutionWithRules extends Institution {
  rules: ConversionRule[]
}
