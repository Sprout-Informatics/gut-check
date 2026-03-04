/**
 * Pool of 30 commensal gut bacteria species used as the reference database
 * for the metagenomic sampling challenge. The main simulation selects 12
 * from this pool; the sampling module uses all 30.
 */
export const COMMENSAL_SPECIES_POOL: string[] = [
  // Original 15
  'Bacteroides',
  'Faecalibacterium',
  'Roseburia',
  'Bifidobacterium',
  'Lactobacillus',
  'Eubacterium',
  'Ruminococcus',
  'Prevotella',
  'Akkermansia',
  'Clostridium_commensal',
  'Blautia',
  'Coprococcus',
  'Dorea',
  'Streptococcus',
  'Enterococcus',
  // Additional 15
  'Lachnospiraceae',
  'Alistipes',
  'Parabacteroides',
  'Dialister',
  'Phascolarctobacterium',
  'Oscillibacter',
  'Subdoligranulum',
  'Anaerostipes',
  'Collinsella',
  'Butyricicoccus',
  'Megamonas',
  'Sutterella',
  'Veillonella',
  'Turicibacter',
  'Fusobacterium',
]
