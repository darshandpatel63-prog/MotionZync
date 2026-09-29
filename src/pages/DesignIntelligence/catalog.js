// MotionZync Design Intelligence — canonical seed catalog.
// Phase 1 stays intentionally small. Free/public records are shipped to the browser;
// protected Premium/Ultra records are served only by the server entitlement layer.
// The schema remains canonical and records must be meaningful and verified before addition.

export const DI_STYLES = [
  { id:'style-minimalism', name:'Minimalism', tier:'free', tags:['clarity','content-first','low-noise'], description:'Intentional reduction of visual noise with clear hierarchy, generous space and restrained decoration.', suitedFor:['SaaS','Productivity','Corporate','Developer Tools'] },
  { id:'style-glassmorphism', name:'Glassmorphism', tier:'free', tags:['translucent','layered','depth'], description:'Layered translucent surfaces with controlled blur and clear contrast boundaries.', suitedFor:['AI Products','SaaS','Creative'] },
  { id:'style-neumorphism', name:'Neumorphism', tier:'free', tags:['soft','tactile','depth'], description:'Soft raised and inset surfaces that create a tactile interface language.', suitedFor:['Health','Wellness','Utilities'] },
  { id:'style-brutalism', name:'Brutalism', tier:'free', tags:['raw','bold','high-contrast'], description:'Strong typography, visible structure and deliberately raw visual treatment.', suitedFor:['Creative','Portfolio','Media'] },
  { id:'style-neo-brutalism', name:'Neo-Brutalism', tier:'free', tags:['bold','playful','outlined'], description:'Bold blocks, expressive borders and playful contrast with usable interaction patterns.', suitedFor:['Education','Startups','Creative'] },
  { id:'style-bento', name:'Bento', tier:'free', tags:['modular','cards','dashboard'], description:'Modular content grouped into varied but coherent panels for quick scanning.', suitedFor:['SaaS','AI Products','Dashboards'] },
  { id:'style-claymorphism', name:'Claymorphism', tier:'free', tags:['soft','friendly','rounded'], description:'Rounded dimensional surfaces with friendly proportions and approachable interaction cues.', suitedFor:['Education','Consumer','Wellness'] },
  { id:'style-aurora', name:'Aurora UI', tier:'free', tags:['gradient','ambient','modern'], description:'Ambient gradient fields used as controlled atmosphere around readable content.', suitedFor:['AI Products','Creative','Marketing'] },
  { id:'style-editorial', name:'Editorial', tier:'free', tags:['typographic','grid','story'], description:'Strong editorial hierarchy, intentional grid systems and content-led composition.', suitedFor:['Media','Publishing','Portfolio'] },
  { id:'style-dark-ui', name:'Dark UI', tier:'free', tags:['dark','contrast','focus'], description:'Dark surfaces with carefully managed elevation, contrast and color accents.', suitedFor:['Developer Tools','Analytics','AI Products'] },
];

export const DI_PALETTES = [
  { id:'palette-slate-cyan', name:'Slate + Cyan', tier:'free', primary:'#0F172A', secondary:'#334155', accent:'#06B6D4', cta:'#0891B2', background:'#020617', surface:'#0F172A', text:'#F8FAFC', muted:'#94A3B8', semantic:{success:'#22C55E',warning:'#F59E0B',error:'#EF4444'}, mood:'technical', tags:['dark','developer','saas'] },
  { id:'palette-violet-indigo', name:'Violet + Indigo', tier:'free', primary:'#6D28D9', secondary:'#4F46E5', accent:'#A78BFA', cta:'#7C3AED', background:'#080A12', surface:'#111827', text:'#F8FAFC', muted:'#9CA3AF', semantic:{success:'#22C55E',warning:'#F59E0B',error:'#F87171'}, mood:'creative', tags:['ai','saas','creative'] },
  { id:'palette-health-teal', name:'Healthcare Teal', tier:'free', primary:'#0F766E', secondary:'#0D9488', accent:'#2DD4BF', cta:'#0F766E', background:'#F8FAFC', surface:'#FFFFFF', text:'#134E4A', muted:'#64748B', semantic:{success:'#16A34A',warning:'#D97706',error:'#DC2626'}, mood:'calm', tags:['healthcare','trust','light'] },
  { id:'palette-warm-amber', name:'Warm Amber', tier:'free', primary:'#92400E', secondary:'#B45309', accent:'#F59E0B', cta:'#D97706', background:'#FFFBEB', surface:'#FFFFFF', text:'#451A03', muted:'#78716C', semantic:{success:'#15803D',warning:'#D97706',error:'#B91C1C'}, mood:'warm', tags:['commerce','food','hospitality'] },
];

export const DI_TYPOGRAPHY = [
  { id:'type-inter-inter', name:'Inter + Inter', tier:'free', heading:'Inter', body:'Inter', mood:'neutral', tags:['ui','saas','dashboard'] },
  { id:'type-space-inter', name:'Space Grotesk + Inter', tier:'free', heading:'Space Grotesk', body:'Inter', mood:'technical', tags:['developer','ai','modern'] },
  { id:'type-playfair-inter', name:'Playfair Display + Inter', tier:'free', heading:'Playfair Display', body:'Inter', mood:'editorial', tags:['luxury','editorial','commerce'] },
  { id:'type-manrope-inter', name:'Manrope + Inter', tier:'free', heading:'Manrope', body:'Inter', mood:'friendly', tags:['consumer','startup','product'] },
  { id:'type-dm-sans', name:'DM Sans + DM Sans', tier:'free', heading:'DM Sans', body:'DM Sans', mood:'clean', tags:['product','marketing','saas'] },
];

export const DI_CHARTS = [
  { id:'chart-kpi-line', name:'KPI + Time Series', tier:'free', family:'line', purpose:'Trend over time', bestFor:['time-series','performance','growth'], avoidFor:['part-to-whole'] },
  { id:'chart-grouped-bar', name:'Grouped Bar Comparison', tier:'free', family:'bar', purpose:'Compare categories across groups', bestFor:['categorical','comparison'], avoidFor:['continuous dense time-series'] },
  { id:'chart-stacked-bar', name:'Stacked Bar Composition', tier:'free', family:'bar', purpose:'Compare totals while showing composition', bestFor:['composition','category-comparison'], avoidFor:['many tiny segments'] },
  { id:'chart-donut-small', name:'Donut for Small Part-to-Whole', tier:'free', family:'donut', purpose:'Show a small number of shares', bestFor:['part-to-whole'], avoidFor:['many categories','precise comparisons'] },
  { id:'chart-heatmap', name:'Heatmap Matrix', tier:'free', family:'heatmap', purpose:'Expose intensity across two dimensions', bestFor:['matrix','time-by-category'], avoidFor:['small datasets'] },
  { id:'chart-scatter', name:'Scatter Relationship', tier:'free', family:'scatter', purpose:'Explore relationships between numeric variables', bestFor:['correlation','distribution'], avoidFor:['single-category summaries'] },
];

export const DI_STACKS = [
  { id:'stack-react', name:'React', tier:'free', category:'frontend', focus:['state','components','performance','accessibility'] },
  { id:'stack-nextjs', name:'Next.js', tier:'free', category:'fullstack-react', focus:['routing','rendering','api-routes','performance'] },
  { id:'stack-vue', name:'Vue', tier:'free', category:'frontend', focus:['composition','state','routing','components'] },
  { id:'stack-svelte', name:'Svelte', tier:'free', category:'frontend', focus:['runes','stores','components','performance'] },
  { id:'stack-swiftui', name:'SwiftUI', tier:'free', category:'native-ios', focus:['views','state','navigation','theming'] },
  { id:'stack-react-native', name:'React Native', tier:'free', category:'cross-platform-mobile', focus:['components','navigation','lists','platform-ui'] },
  { id:'stack-flutter', name:'Flutter', tier:'free', category:'cross-platform-mobile', focus:['widgets','state','theming','responsive-ui'] },
  { id:'stack-tailwind', name:'Tailwind CSS', tier:'free', category:'styling', focus:['utilities','responsive','accessibility','tokens'] },
];

export const DI_RECIPES = [
  { id:'recipe-free-saas-dashboard', name:'Focused SaaS Analytics Dashboard', tier:'free', styleId:'style-minimalism', paletteId:'palette-slate-cyan', typographyId:'type-inter-inter', chartIds:['chart-kpi-line','chart-grouped-bar'], stackIds:['stack-react','stack-tailwind'], layout:'Persistent sidebar + KPI row + primary analytics panel', navigation:'Persistent sidebar', ux:['progressive disclosure','clear loading states','keyboard-visible focus'] },
  { id:'recipe-free-ai-workspace', name:'AI Developer Workspace', tier:'free', styleId:'style-dark-ui', paletteId:'palette-violet-indigo', typographyId:'type-space-inter', chartIds:['chart-kpi-line'], stackIds:['stack-react','stack-nextjs'], layout:'Command sidebar + main workspace + inspector rail', navigation:'Collapsible sidebar + command palette', ux:['keyboard-first actions','non-blocking feedback','reduced-motion support'] },
];

export const ALL_DI_RECORDS = [
  ...DI_STYLES.map(record=>({ ...record, domain:'styles' })),
  ...DI_PALETTES.map(record=>({ ...record, domain:'palettes' })),
  ...DI_TYPOGRAPHY.map(record=>({ ...record, domain:'typography' })),
  ...DI_CHARTS.map(record=>({ ...record, domain:'charts' })),
  ...DI_STACKS.map(record=>({ ...record, domain:'stacks' })),
  ...DI_RECIPES.map(record=>({ ...record, domain:'recipes' })),
];
