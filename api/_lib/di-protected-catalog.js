// MotionZync Design Intelligence — server-only protected catalog.
// This file is imported only by Vercel/API code. Do not import it from client-side
// React modules. Protected records must never be shipped in the public browser bundle.

export const DI_PROTECTED_STYLES = [
  { id:'style-premium-enterprise-depth', name:'Enterprise Depth', tier:'premium', tags:['enterprise','depth','high-signal'], description:'Structured enterprise visual language with strong information hierarchy and restrained depth.', suitedFor:['Fintech','Enterprise','Analytics'] },
]

export const DI_PROTECTED_PALETTES = [
  { id:'palette-royal-sapphire', name:'Royal Sapphire', tier:'premium', primary:'#1D4ED8', secondary:'#3730A3', accent:'#60A5FA', cta:'#2563EB', background:'#071225', surface:'#0F1D3A', text:'#EFF6FF', muted:'#93C5FD', semantic:{success:'#34D399',warning:'#FBBF24',error:'#FB7185'}, mood:'premium', tags:['fintech','enterprise','premium'] },
]

export const DI_PROTECTED_TYPOGRAPHY = []

export const DI_PROTECTED_CHARTS = []

export const DI_PROTECTED_STACKS = []

export const DI_PROTECTED_RECIPES = [
  { id:'recipe-premium-fintech', name:'Premium Fintech Intelligence Console', tier:'premium', styleId:'style-dark-ui', paletteId:'palette-royal-sapphire', typographyId:'type-space-inter', chartIds:['chart-kpi-line','chart-stacked-bar','chart-scatter'], stackIds:['stack-nextjs','stack-tailwind'], layout:'Data-dense split dashboard with persistent risk context', navigation:'Persistent sidebar + contextual sub-navigation', ux:['progressive disclosure','high-signal alerts','dense table ergonomics'] },
  { id:'recipe-ultra-editorial-commerce', name:'Ultra Editorial Commerce', tier:'ultra-premium', styleId:'style-editorial', paletteId:'palette-royal-sapphire', typographyId:'type-playfair-inter', chartIds:[], stackIds:['stack-nextjs','stack-tailwind'], layout:'Editorial grid + immersive product story + conversion rail', navigation:'Minimal header + contextual section navigation', ux:['content-first hierarchy','controlled motion','high-intent CTA placement'] },
]

export const ALL_DI_PROTECTED_RECORDS = [
  ...DI_PROTECTED_STYLES.map(record=>({ ...record, domain:'styles' })),
  ...DI_PROTECTED_PALETTES.map(record=>({ ...record, domain:'palettes' })),
  ...DI_PROTECTED_TYPOGRAPHY.map(record=>({ ...record, domain:'typography' })),
  ...DI_PROTECTED_CHARTS.map(record=>({ ...record, domain:'charts' })),
  ...DI_PROTECTED_STACKS.map(record=>({ ...record, domain:'stacks' })),
  ...DI_PROTECTED_RECIPES.map(record=>({ ...record, domain:'recipes' })),
]
