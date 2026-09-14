import type { InstitutionWithRules } from './types'

/**
 * India-wide institution registry.
 *
 * PROVENANCE RULE: every ConversionRule in here must carry a `status` and, when
 * `status === 'official'`, a `source` with a real, checkable URL or document title.
 * Never invent a coefficient to "fill in" an institution — an institution with no
 * verified rule yet should still be listed (so it's searchable and requests for it
 * are visible) but simply carry no rules, or a rule explicitly marked 'unverified'
 * with notes on what was found and why it couldn't be confirmed.
 *
 * This list starts intentionally small. It grows only as formulas are verified
 * against official university/UGC/AICTE documents — see the /methodology page for
 * the verification standard applied. Each entry below was checked by fetching and
 * reading the primary document itself (not just a secondary summary) on 2026-09-14.
 */

const VERIFIED_AT = '2026-09-14'

export const institutions: InstitutionWithRules[] = [
  {
    id: 'university-of-delhi',
    name: 'University of Delhi',
    shortName: 'DU',
    aliases: ['Delhi University'],
    type: 'Central University',
    city: 'New Delhi',
    state: 'Delhi',
    programmes: ['BA', 'B.Com', 'B.Sc.', 'MA', 'M.Sc.', 'M.Com'],
    scaleMax: 10,
    gradingScaleDescription: '10-point CBCS CGPA scale',
    website: 'https://www.du.ac.in',
    hasOfficialConversion: true,
    notes:
      "Confirmed for six-semester UG CBCS and four-semester PG CBCS courses. Not confirmed for DU's 2022 NEP four-year (8-semester) UG batches — no newer DU notification extending this formula to NEP batches was found.",
    rules: [
      {
        id: 'du-ug-cbcs',
        institutionId: 'university-of-delhi',
        programme: 'UG (CBCS, 6-semester: BA/B.Com/B.Sc. incl. Honours)',
        regulation: 'CBCS, applicable from May/June 2018 examinations onward',
        operation: 'cgpa_to_percentage',
        scaleMax: 10,
        formulaType: 'linear',
        a: 9.5,
        b: 0,
        formulaDisplay: 'CGPA x 9.5',
        status: 'official',
        source: {
          type: 'official',
          title: 'Notification — Formula for conversion of CGPA into percentage of marks (Ref. Dean(Exams)/2017/9126)',
          url: 'https://exam.du.ac.in/old/pdf/11012018/11012018_CGPA.pdf',
          verifiedAt: VERIFIED_AT,
        },
        notes: 'Only the conversion formula (not a pre-computed percentage) is printed on the DU Grade Certificate/Transcript.',
      },
      {
        id: 'du-pg-cbcs',
        institutionId: 'university-of-delhi',
        programme: 'PG (CBCS, 4-semester: MA/M.Sc./M.Com etc.)',
        regulation: 'CBCS, per Ordinance IX(8), notified 18.10.2019',
        operation: 'cgpa_to_percentage',
        scaleMax: 10,
        formulaType: 'linear',
        a: 9.5,
        b: 0,
        formulaDisplay: 'CGPA x 9.5',
        status: 'official',
        source: {
          type: 'official',
          title: 'Notification — Amendments to Ordinances, Executive Council Resolution No. 33-10 (Ord. IX(8))',
          url: 'https://www.du.ac.in/uploads/Rules_Policies_Ordinances/Acts/23102019_28_Notification_E.C.20-21.07.2019%20dated%2018.10.2019%20-%20B%20(Ord.%20IX%20(8))%20(DUCC).pdf',
          verifiedAt: VERIFIED_AT,
        },
        notes: "Same multiplier as UG but over 4 semesters, not 6. Programmes regulated by other bodies (e.g. MCI, AICTE) follow that regulator's own formula instead.",
      },
    ],
  },
  {
    id: 'jadavpur-university',
    name: 'Jadavpur University',
    shortName: 'JU',
    aliases: [],
    type: 'State University',
    city: 'Kolkata',
    state: 'West Bengal',
    programmes: ['BE', 'B.Tech', 'M.Tech'],
    scaleMax: 10,
    gradingScaleDescription: '10-point CGPA scale (AICTE-aligned for Engineering/Technology)',
    website: 'https://www.jaduniv.edu.in',
    hasOfficialConversion: true,
    notes:
      "Verified only for AICTE-approved Engineering/Technology (B.E./B.Tech) programmes. No verifiable official conversion formula was found for Jadavpur's non-AICTE faculties (Science, Arts, Commerce, non-AICTE PG) — check your own faculty's examination handbook rather than assuming this formula applies.",
    rules: [
      {
        id: 'ju-ug-engg',
        institutionId: 'jadavpur-university',
        programme: 'B.E. / B.Tech (AICTE-approved Engineering & Technology)',
        regulation: '*',
        operation: 'cgpa_to_percentage',
        scaleMax: 10,
        formulaType: 'linear',
        a: 10,
        b: -7.5,
        formulaDisplay: '(CGPA - 0.75) x 10',
        status: 'official',
        source: {
          type: 'official',
          title:
            'AICTE Grade-Percentage Conversion Table, Table E6 (F.No. 1-65/CD/NEC/98-99 dated 15.03.2000), certified/adopted by the Jadavpur University Controller of Examinations',
          url: 'https://jadavpuruniversity.in/wp-content/uploads/2022/11/UG-AICTE_Sgpa_Percentage_Converter.pdf',
          verifiedAt: VERIFIED_AT,
        },
        notes: 'Every row of the official AICTE table (6.25→55%, …, 9.0→82.5%) matches this formula exactly.',
      },
    ],
  },
  {
    id: 'vtu',
    name: 'Visvesvaraya Technological University',
    shortName: 'VTU',
    aliases: [],
    type: 'State University',
    city: 'Belagavi',
    state: 'Karnataka',
    programmes: ['BE', 'B.Tech', 'M.Tech'],
    scaleMax: 10,
    gradingScaleDescription: '10-point CGPA scale',
    website: 'https://vtu.ac.in',
    hasOfficialConversion: true,
    notes:
      'Confirmed for the 2015/2017/2018 schemes via VTU\'s own published page. Secondary sources claim the 2022 scheme switched to a plain "CGPA x 10", but this could not be confirmed on vtu.ac.in — recheck before using for 2022-scheme batches.',
    rules: [
      {
        id: 'vtu-2015-2018',
        institutionId: 'vtu',
        programme: '*',
        regulation: '2015 / 2017 / 2018 schemes',
        operation: 'cgpa_to_percentage',
        scaleMax: 10,
        formulaType: 'linear',
        a: 10,
        b: -7.5,
        formulaDisplay: '(CGPA - 0.75) x 10',
        status: 'official',
        source: {
          type: 'official',
          title: 'VTU official page — CGPA Standard Formula',
          url: 'https://vtu.ac.in/en/cgpa-standard-formula',
          verifiedAt: VERIFIED_AT,
        },
        notes: 'No explicit circular number or date is shown on the source page itself.',
      },
    ],
  },
  {
    id: 'makaut',
    name: 'Maulana Abul Kalam Azad University of Technology, West Bengal',
    shortName: 'MAKAUT',
    aliases: ['WBUT', 'West Bengal University of Technology'],
    type: 'State University',
    city: 'Kolkata',
    state: 'West Bengal',
    programmes: ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'MBA'],
    scaleMax: 10,
    gradingScaleDescription: '10-point CGPA scale',
    website: 'https://makautwb.ac.in',
    hasOfficialConversion: true,
    notes:
      'The circular reference commonly cited by secondary sites ("Letter No. COE/MAKAUT,WB/2021-22/0357") could not be independently confirmed on the fetched document, but the conversion table itself is officially hosted on makautwb.ac.in and is internally consistent with the AICTE Table E6 values.',
    rules: [
      {
        id: 'makaut-default',
        institutionId: 'makaut',
        programme: '*',
        regulation: '*',
        operation: 'cgpa_to_percentage',
        scaleMax: 10,
        formulaType: 'linear',
        a: 10,
        b: -7.5,
        formulaDisplay: '(CGPA - 0.75) x 10',
        status: 'official',
        source: {
          type: 'official',
          title: 'How to Calculate Percentage from Your Grade Point',
          url: 'https://makautwb.ac.in/announcement/Process_to_Calculate_Percentage_From_Grade_Point.pdf',
          verifiedAt: VERIFIED_AT,
        },
      },
    ],
  },
  {
    id: 'iit-roorkee',
    name: 'Indian Institute of Technology Roorkee',
    shortName: 'IIT Roorkee',
    aliases: [],
    type: 'IIT',
    city: 'Roorkee',
    state: 'Uttarakhand',
    programmes: ['B.Tech', 'M.Tech', 'M.Sc.', 'PhD'],
    scaleMax: 10,
    gradingScaleDescription: '10-point CGPA scale',
    website: 'https://iitr.ac.in',
    hasOfficialConversion: true,
    notes: 'IITs set their own conversion rules independently — there is no common cross-IIT formula.',
    rules: [
      {
        id: 'iit-roorkee-default',
        institutionId: 'iit-roorkee',
        programme: '*',
        regulation: '*',
        operation: 'cgpa_to_percentage',
        scaleMax: 10,
        formulaType: 'linear',
        a: 10,
        b: 0,
        formulaDisplay: 'CGPA x 10',
        status: 'official',
        source: {
          type: 'official',
          title: 'Notification — Conversion of CGPA to equivalent percentage (Item No. 101.9), 101st Senate meeting',
          url: 'https://iitr.ac.in/Academics/static/Notifications/General%20Notifications/101.9_CGPA_conversion.pdf',
          verifiedAt: VERIFIED_AT,
        },
        notes: 'Described in the notification as a "notional" conversion. CGPA ≥ 6.0 is separately treated as First Division for external/recruitment purposes.',
      },
    ],
  },
  {
    id: 'iit-tirupati',
    name: 'Indian Institute of Technology Tirupati',
    shortName: 'IIT Tirupati',
    aliases: [],
    type: 'IIT',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    programmes: ['B.Tech', 'M.Tech', 'PhD'],
    scaleMax: 10,
    gradingScaleDescription: '10-point CGPA scale',
    website: 'https://iittp.ac.in',
    hasOfficialConversion: true,
    notes: 'IITs set their own conversion rules independently — there is no common cross-IIT formula.',
    rules: [
      {
        id: 'iit-tirupati-default',
        institutionId: 'iit-tirupati',
        programme: '*',
        regulation: '*',
        operation: 'cgpa_to_percentage',
        scaleMax: 10,
        formulaType: 'linear',
        a: 10,
        b: 0,
        formulaDisplay: 'CGPA x 10',
        status: 'official',
        source: {
          type: 'official',
          title: 'Conversion of CGPA into Percentage (Ref. IITTP/Acad/O&R/2020-21)',
          url: 'https://files.iittp.ac.in/pdfs/downloads/Conversion%20of%20CGPA%20into%20Percentage_16-2-2023.pdf',
          verifiedAt: VERIFIED_AT,
        },
        notes: 'The source explicitly states CGPA/grade points are "not convertible" in a formal sense — this is a notional conversion, applicable to all programmes/departments regardless of graduation year.',
      },
    ],
  },
  {
    id: 'anna-university',
    name: 'Anna University',
    shortName: 'Anna University',
    aliases: [],
    type: 'State University',
    city: 'Chennai',
    state: 'Tamil Nadu',
    programmes: ['BE', 'B.Tech', 'ME', 'M.Tech'],
    scaleMax: 10,
    gradingScaleDescription: '10-point CGPA scale',
    website: 'https://www.annauniv.edu',
    hasOfficialConversion: false,
    notes:
      'No official Anna University document could be located or fetched confirming a general conversion formula. Anna University reportedly issues individual CGPA-to-percentage certificates on request via its Controller of Examinations rather than publishing one.',
    rules: [
      {
        id: 'anna-university-unverified',
        institutionId: 'anna-university',
        programme: '*',
        regulation: 'R-2013 / R-2017 / R-2021 (per secondary sources)',
        operation: 'cgpa_to_percentage',
        scaleMax: 10,
        formulaType: 'linear',
        a: 10,
        b: 0,
        formulaDisplay: 'CGPA x 10',
        status: 'unverified',
        source: {
          type: 'secondary',
          title: 'Widely repeated by third-party CGPA calculator sites, citing an unconfirmed "Letter No. 001/ACOE(UDs)/2021 dated 14.04.2021"',
          url: '',
          verifiedAt: VERIFIED_AT,
        },
        notes: 'Not confirmed against any primary annauniv.edu / acoe.annauniv.edu document — treat as an estimate only.',
      },
    ],
  },
  {
    id: 'university-of-calcutta',
    name: 'University of Calcutta',
    shortName: 'CU',
    aliases: ['Calcutta University'],
    type: 'State University',
    city: 'Kolkata',
    state: 'West Bengal',
    programmes: ['BA', 'B.Sc.', 'MA', 'M.Sc.'],
    scaleMax: 10,
    gradingScaleDescription: '10-point CGPA scale (CCF 2022 UG regulations)',
    website: 'https://www.caluniv.ac.in',
    hasOfficialConversion: false,
    notes:
      'The official CCF 2022 UG examination regulations define a 10-point CGPA scale whose internal marks-to-grade-point bands are consistent with roughly CGPA x 10, but do not themselves state an explicit CGPA-to-percentage conversion formula. A separately cited "Notification CSR/143/2024", which some secondary sites say states this formula directly, could not be located on caluniv.ac.in.',
    rules: [
      {
        id: 'calcutta-university-inferred',
        institutionId: 'university-of-calcutta',
        programme: 'UG Multidisciplinary Courses (CCF 2022)',
        regulation: 'CCF 2022, effective session 2023-24 onward',
        operation: 'cgpa_to_percentage',
        scaleMax: 10,
        formulaType: 'linear',
        a: 10,
        b: 0,
        formulaDisplay: 'CGPA x 10 (approximate — inferred, not explicitly stated)',
        status: 'unverified',
        source: {
          type: 'official',
          title: 'Regulations relating to Examinations for the semester-wise Three-Year B.A./B.Sc. (MDC, CCF 2022), Notification CSR/43/2023',
          url: 'https://www.caluniv.ac.in/ccf-ug/files/exam-regu-BA-BSC-MDC-CSR-43.pdf',
          verifiedAt: VERIFIED_AT,
        },
        notes: 'This official document does not contain an explicit reverse conversion formula — the coefficient here is inferred from consistent grade-point/percentage band boundaries, not a directly stated rule.',
      },
    ],
  },
  {
    id: 'university-of-mumbai',
    name: 'University of Mumbai',
    shortName: 'Mumbai University',
    aliases: [],
    type: 'State University',
    city: 'Mumbai',
    state: 'Maharashtra',
    programmes: ['BA', 'B.Sc.', 'B.Com', 'BE'],
    scaleMax: 10,
    gradingScaleDescription: 'Varies by programme',
    website: 'https://mu.ac.in',
    hasOfficialConversion: false,
    notes:
      'No official University of Mumbai document could be located or fetched. Secondary sites cite a pre-2026 formula ((CGPA x 7.1) + 11 for general streams, (CGPA x 7.4) + 12 for engineering, attributing it to "Circular No. Exam/Com/97 of 2018") and separately claim formula-based conversion was repealed university-wide effective 1 January 2026 in favour of college-computed certificates. Neither claim is verified against a primary mu.ac.in document — no rule is listed here until one is found. Check mu.ac.in directly.',
    rules: [],
  },
]

export function findInstitutionById(id: string): InstitutionWithRules | undefined {
  return institutions.find((inst) => inst.id === id)
}

export function searchInstitutions(query: string): InstitutionWithRules[] {
  const q = query.trim().toLowerCase()
  if (q === '') return institutions
  return institutions.filter((inst) => {
    const haystack = [inst.name, inst.shortName ?? '', inst.city, inst.state, ...inst.aliases].join(' ').toLowerCase()
    return haystack.includes(q)
  })
}
