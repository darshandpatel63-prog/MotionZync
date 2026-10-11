// MotionZync Design Intelligence — canonical seed catalog.
// Curated canonical seed catalog shared by Explorer and Generator.
// Free/public records ship to the browser; protected Premium/Ultra knowledge is server-gated.
// These are design ingredients/recipes, not extra UI-template records or database rows.

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

  { id:'style-gradient-mesh', name:'Gradient Mesh', tier:'free', tags:['gradient','ambient','depth','marketing'], description:'Soft multi-colour fields add atmosphere while content surfaces retain readable contrast.', suitedFor:['AI Products','Marketing','Creative'] },
  { id:'style-swiss-grid', name:'Swiss Grid', tier:'free', tags:['grid','alignment','typographic','clarity'], description:'A disciplined grid, precise alignment and strong hierarchy keep complex content legible.', suitedFor:['Corporate','Publishing','Dashboards'] },
  { id:'style-data-dense', name:'Data Dense', tier:'free', tags:['compact','analytics','tables','operations'], description:'A compact information system prioritises visible data, scan paths and efficient comparison.', suitedFor:['Analytics','Operations','Developer Tools'] },
  { id:'style-outline', name:'Outline Surfaces', tier:'free', tags:['outlined','flat','structure','minimal'], description:'Clear borders and flat surfaces distinguish groups without relying on heavy shadows.', suitedFor:['Productivity','Settings','Enterprise'] },
  { id:'style-organic', name:'Organic Forms', tier:'free', tags:['natural','warm','rounded','wellness'], description:'Natural curves, calm spacing and subtle surface contrast create a grounded interface.', suitedFor:['Wellness','Sustainability','Food'] },
  { id:'style-retro-futurism', name:'Retro Futurism', tier:'free', tags:['neon','dark','technical','expressive'], description:'A dark technical canvas with selective luminous accents and geometric structure.', suitedFor:['Creative Tools','Gaming','Developer Tools'] },
  { id:'style-masonry-editorial', name:'Masonry Editorial', tier:'free', tags:['asymmetric','editorial','cards','discovery'], description:'A varied card rhythm supports browsing mixed media while preserving predictable reading order.', suitedFor:['Media','Portfolio','Collections'] },
  { id:'style-soft-ui', name:'Soft UI', tier:'free', tags:['soft','subtle-depth','friendly','surfaces'], description:'Gentle elevation and restrained borders create depth without low-contrast controls.', suitedFor:['Consumer','Productivity','Wellness'] },
  { id:'style-mono-editorial', name:'Monochrome Editorial', tier:'free', tags:['monochrome','typography','editorial','focus'], description:'A restrained grayscale palette puts content hierarchy and typography in the foreground.', suitedFor:['Publishing','Portfolio','Documentation'] },
  { id:'style-skeuomorphic-lite', name:'Skeuomorphic Details', tier:'free', tags:['familiar','tactile','controlled-depth'], description:'Small tactile cues reinforce controls without turning the whole interface into a literal physical object.', suitedFor:['Utilities','Audio Tools','Creative Apps'] },
];

export const DI_PALETTES = [
  { id:'palette-slate-cyan', name:'Slate + Cyan', tier:'free', primary:'#0F172A', secondary:'#334155', accent:'#06B6D4', cta:'#0891B2', background:'#020617', surface:'#0F172A', text:'#F8FAFC', muted:'#94A3B8', semantic:{success:'#22C55E',warning:'#F59E0B',error:'#EF4444'}, mood:'technical', tags:['dark','developer','saas'] },
  { id:'palette-violet-indigo', name:'Violet + Indigo', tier:'free', primary:'#6D28D9', secondary:'#4F46E5', accent:'#A78BFA', cta:'#7C3AED', background:'#080A12', surface:'#111827', text:'#F8FAFC', muted:'#9CA3AF', semantic:{success:'#22C55E',warning:'#F59E0B',error:'#F87171'}, mood:'creative', tags:['ai','saas','creative'] },
  { id:'palette-health-teal', name:'Healthcare Teal', tier:'free', primary:'#0F766E', secondary:'#0D9488', accent:'#2DD4BF', cta:'#0F766E', background:'#F8FAFC', surface:'#FFFFFF', text:'#134E4A', muted:'#64748B', semantic:{success:'#16A34A',warning:'#D97706',error:'#DC2626'}, mood:'calm', tags:['healthcare','trust','light'] },
  { id:'palette-warm-amber', name:'Warm Amber', tier:'free', primary:'#92400E', secondary:'#B45309', accent:'#F59E0B', cta:'#D97706', background:'#FFFBEB', surface:'#FFFFFF', text:'#451A03', muted:'#78716C', semantic:{success:'#15803D',warning:'#D97706',error:'#B91C1C'}, mood:'warm', tags:['commerce','food','hospitality'] },
  { id:'palette-ocean-blue', name:'Ocean Blue', tier:'free', primary:'#123B5D', secondary:'#155E75', accent:'#0EA5E9', cta:'#0369A1', background:'#F0F9FF', surface:'#FFFFFF', text:'#0C2438', muted:'#475569', semantic:{success:'#15803D',warning:'#B45309',error:'#B91C1C'}, mood:'clear', tags:['ocean','trust','saas','light'] },
  { id:'palette-forest-sage', name:'Forest + Sage', tier:'free', primary:'#1F4D3A', secondary:'#3F6F52', accent:'#A3B18A', cta:'#2D6A4F', background:'#F4F7F2', surface:'#FFFFFF', text:'#172C22', muted:'#52655A', semantic:{success:'#15803D',warning:'#A16207',error:'#B91C1C'}, mood:'grounded', tags:['nature','wellness','sustainability','light'] },
  { id:'palette-rose-editorial', name:'Rose Editorial', tier:'free', primary:'#9F1239', secondary:'#881337', accent:'#FB7185', cta:'#BE123C', background:'#FFF1F2', surface:'#FFFFFF', text:'#4C0519', muted:'#7F1D3A', semantic:{success:'#15803D',warning:'#A16207',error:'#B91C1C'}, mood:'expressive', tags:['editorial','fashion','portfolio','light'] },
  { id:'palette-midnight-plum', name:'Midnight Plum', tier:'free', primary:'#2E1065', secondary:'#4C1D95', accent:'#C084FC', cta:'#7E22CE', background:'#100A1F', surface:'#1B1230', text:'#F5F3FF', muted:'#C4B5FD', semantic:{success:'#4ADE80',warning:'#FBBF24',error:'#FDA4AF'}, mood:'immersive', tags:['dark','creative','ai','premium-look'] },
  { id:'palette-graphite-mono', name:'Graphite Monochrome', tier:'free', primary:'#111827', secondary:'#374151', accent:'#6B7280', cta:'#111827', background:'#F8FAFC', surface:'#FFFFFF', text:'#111827', muted:'#4B5563', semantic:{success:'#166534',warning:'#92400E',error:'#991B1B'}, mood:'restrained', tags:['monochrome','minimal','enterprise','light'] },
  { id:'palette-citrus-energy', name:'Citrus Energy', tier:'free', primary:'#365314', secondary:'#4D7C0F', accent:'#84CC16', cta:'#3F6212', background:'#FEFCE8', surface:'#FFFFFF', text:'#292524', muted:'#57534E', semantic:{success:'#166534',warning:'#92400E',error:'#991B1B'}, mood:'energetic', tags:['bright','education','fitness','light'] },
  { id:'palette-sand-terracotta', name:'Sand + Terracotta', tier:'free', primary:'#6B3F2A', secondary:'#9A3412', accent:'#C26D4A', cta:'#9A3412', background:'#FAF7F2', surface:'#FFFFFF', text:'#352A23', muted:'#68584C', semantic:{success:'#166534',warning:'#92400E',error:'#991B1B'}, mood:'craft', tags:['warm','hospitality','craft','light'] },
  { id:'palette-ice-lavender', name:'Ice + Lavender', tier:'free', primary:'#4C1D95', secondary:'#6D28D9', accent:'#8B5CF6', cta:'#6D28D9', background:'#F5F3FF', surface:'#FFFFFF', text:'#211A32', muted:'#655B78', semantic:{success:'#166534',warning:'#92400E',error:'#991B1B'}, mood:'calm-creative', tags:['lavender','productivity','creative','light'] },
  { id:'palette-teal-night', name:'Teal Night', tier:'free', primary:'#0F766E', secondary:'#115E59', accent:'#2DD4BF', cta:'#0F766E', background:'#071F25', surface:'#0B2D33', text:'#ECFEFF', muted:'#A5C8CC', semantic:{success:'#4ADE80',warning:'#FBBF24',error:'#FDA4AF'}, mood:'focused', tags:['dark','healthcare','analytics','teal'] },
  { id:'palette-warm-sunset', name:'Warm Sunset', tier:'free', primary:'#9A3412', secondary:'#C2410C', accent:'#F97316', cta:'#C2410C', background:'#FFF7ED', surface:'#FFFFFF', text:'#431407', muted:'#7C2D12', semantic:{success:'#166534',warning:'#92400E',error:'#991B1B'}, mood:'warm-bold', tags:['sunset','commerce','food','light'] },
];

export const DI_TYPOGRAPHY = [
  { id:'type-inter-inter', name:'Inter + Inter', tier:'free', heading:'Inter', body:'Inter', mood:'neutral', tags:['ui','saas','dashboard'] },
  { id:'type-space-inter', name:'Space Grotesk + Inter', tier:'free', heading:'Space Grotesk', body:'Inter', mood:'technical', tags:['developer','ai','modern'] },
  { id:'type-playfair-inter', name:'Playfair Display + Inter', tier:'free', heading:'Playfair Display', body:'Inter', mood:'editorial', tags:['luxury','editorial','commerce'] },
  { id:'type-manrope-inter', name:'Manrope + Inter', tier:'free', heading:'Manrope', body:'Inter', mood:'friendly', tags:['consumer','startup','product'] },
  { id:'type-dm-sans', name:'DM Sans + DM Sans', tier:'free', heading:'DM Sans', body:'DM Sans', mood:'clean', tags:['product','marketing','saas'] },

  { id:'type-ibm-plex-sans-mono', name:'IBM Plex Sans + IBM Plex Mono', tier:'free', heading:'IBM Plex Sans', body:'IBM Plex Mono', mood:'technical', tags:['developer','code','metrics'] },
  { id:'type-ibm-plex-mono-inter', name:'IBM Plex Mono + Inter', tier:'free', heading:'IBM Plex Mono', body:'Inter', mood:'instrumental', tags:['data','terminal','analytics'] },
  { id:'type-source-serif-sans', name:'Source Serif 4 + Source Sans 3', tier:'free', heading:'Source Serif 4', body:'Source Sans 3', mood:'editorial', tags:['publishing','long-form','editorial'] },
  { id:'type-plus-jakarta-inter', name:'Plus Jakarta Sans + Inter', tier:'free', heading:'Plus Jakarta Sans', body:'Inter', mood:'confident', tags:['saas','product','startup'] },
  { id:'type-lora-inter', name:'Lora + Inter', tier:'free', heading:'Lora', body:'Inter', mood:'warm-editorial', tags:['storytelling','commerce','publishing'] },
  { id:'type-roboto-roboto', name:'Roboto + Roboto', tier:'free', heading:'Roboto', body:'Roboto', mood:'familiar', tags:['mobile','utility','material'] },
  { id:'type-newsreader-dm', name:'Newsreader + DM Sans', tier:'free', heading:'Newsreader', body:'DM Sans', mood:'literary', tags:['articles','news','editorial'] },
  { id:'type-fraunces-manrope', name:'Fraunces + Manrope', tier:'free', heading:'Fraunces', body:'Manrope', mood:'expressive', tags:['lifestyle','creative','commerce'] },
  { id:'type-outfit-inter', name:'Outfit + Inter', tier:'free', heading:'Outfit', body:'Inter', mood:'geometric', tags:['saas','consumer','modern'] },
  { id:'type-work-sans-source', name:'Work Sans + Source Sans 3', tier:'free', heading:'Work Sans', body:'Source Sans 3', mood:'practical', tags:['admin','operations','enterprise'] },
  { id:'type-space-dm', name:'Space Grotesk + DM Sans', tier:'free', heading:'Space Grotesk', body:'DM Sans', mood:'technical-friendly', tags:['ai','developer','product'] },
];

export const DI_CHARTS = [
  { id:'chart-kpi-line', name:'KPI + Time Series', tier:'free', family:'line', purpose:'Trend over time', bestFor:['time-series','performance','growth'], avoidFor:['part-to-whole'] },
  { id:'chart-grouped-bar', name:'Grouped Bar Comparison', tier:'free', family:'bar', purpose:'Compare categories across groups', bestFor:['categorical','comparison'], avoidFor:['continuous dense time-series'] },
  { id:'chart-stacked-bar', name:'Stacked Bar Composition', tier:'free', family:'bar', purpose:'Compare totals while showing composition', bestFor:['composition','category-comparison'], avoidFor:['many tiny segments'] },
  { id:'chart-donut-small', name:'Donut for Small Part-to-Whole', tier:'free', family:'donut', purpose:'Show a small number of shares', bestFor:['part-to-whole'], avoidFor:['many categories','precise comparisons'] },
  { id:'chart-heatmap', name:'Heatmap Matrix', tier:'free', family:'heatmap', purpose:'Expose intensity across two dimensions', bestFor:['matrix','time-by-category'], avoidFor:['small datasets'] },
  { id:'chart-scatter', name:'Scatter Relationship', tier:'free', family:'scatter', purpose:'Explore relationships between numeric variables', bestFor:['correlation','distribution'], avoidFor:['single-category summaries'] },

  { id:'chart-area-trend', name:'Area Trend', tier:'free', family:'area', purpose:'Show how a measured value changes over time with a subtle magnitude fill', bestFor:['time-series','volume','cumulative trend'], avoidFor:['many overlapping series','precise point comparisons'] },
  { id:'chart-sparkline-kpi', name:'KPI Sparkline', tier:'free', family:'sparkline', purpose:'Add compact trend context next to a key metric', bestFor:['KPI cards','small trend summaries'], avoidFor:['detailed axis reading','long histories needing annotations'] },
  { id:'chart-histogram', name:'Histogram Distribution', tier:'free', family:'histogram', purpose:'Show how numeric observations are distributed into bins', bestFor:['distribution','frequency','quality checks'], avoidFor:['categorical labels without numeric bins'] },
  { id:'chart-box-whisker', name:'Box-and-Whisker', tier:'free', family:'boxplot', purpose:'Compare median, spread and potential outliers across groups', bestFor:['statistical comparison','multiple distributions'], avoidFor:['audiences unfamiliar with quartiles without explanation'] },
  { id:'chart-funnel-conversion', name:'Conversion Funnel', tier:'free', family:'funnel', purpose:'Explain sequential stages and where volume drops off', bestFor:['conversion','onboarding','sales stages'], avoidFor:['unordered categories','negative values'] },
  { id:'chart-waterfall', name:'Waterfall Change Breakdown', tier:'free', family:'waterfall', purpose:'Explain how additions and deductions produce a final total', bestFor:['financial variance','budget changes','contribution analysis'], avoidFor:['unrelated standalone measures'] },
  { id:'chart-treemap', name:'Treemap Hierarchy', tier:'free', family:'treemap', purpose:'Show hierarchical part-to-whole data using nested rectangles', bestFor:['space allocation','nested categories'], avoidFor:['precise close-value comparisons'] },
  { id:'chart-radar', name:'Radar Profile', tier:'free', family:'radar', purpose:'Compare a small set of shared dimensions across profiles', bestFor:['multidimensional profiles','capability comparisons'], avoidFor:['many series','dimensions with incompatible scales'] },
  { id:'chart-timeline-gantt', name:'Timeline / Gantt', tier:'free', family:'timeline', purpose:'Show task duration, sequence and schedule overlap', bestFor:['project planning','roadmaps','schedules'], avoidFor:['unordered events','large datasets without filtering'] },
  { id:'chart-sankey-flow', name:'Sankey Flow', tier:'free', family:'sankey', purpose:'Trace quantities moving between connected stages', bestFor:['journeys','resource flows','process analysis'], avoidFor:['unweighted relationships','too many crossing links'] },
  { id:'chart-bullet-target', name:'Bullet Target', tier:'free', family:'bullet', purpose:'Compare actual performance with a target and qualitative ranges', bestFor:['target attainment','compact business metrics'], avoidFor:['unexplained qualitative thresholds'] },
  { id:'chart-control-run', name:'Control / Run Chart', tier:'free', family:'control', purpose:'Distinguish routine variation from process signals over time', bestFor:['quality monitoring','operations','process stability'], avoidFor:['unordered categorical data'] },
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

  { id:'stack-angular', name:'Angular', tier:'free', category:'frontend', focus:['components','routing','forms','enterprise-ui'] },
  { id:'stack-astro', name:'Astro', tier:'free', category:'content-focused-web', focus:['content','islands','static-rendering','performance'] },
  { id:'stack-nuxt', name:'Nuxt', tier:'free', category:'fullstack-vue', focus:['routing','server-rendering','data-fetching','vue'] },
  { id:'stack-sveltekit', name:'SvelteKit', tier:'free', category:'fullstack-svelte', focus:['routing','server-rendering','forms','svelte'] },
  { id:'stack-expo', name:'Expo', tier:'free', category:'cross-platform-mobile', focus:['react-native','routing','builds','platform-ui'] },
  { id:'stack-jetpack-compose', name:'Jetpack Compose', tier:'free', category:'native-android', focus:['kotlin','declarative-ui','state','android'] },
  { id:'stack-vanilla-web', name:'HTML + CSS + JavaScript', tier:'free', category:'web-platform', focus:['standards','small-bundles','progressive-enhancement','accessibility'] },
  { id:'stack-css-modules', name:'CSS Modules', tier:'free', category:'styling', focus:['scoping','components','maintainability','tokens'] },
  { id:'stack-d3', name:'D3.js', tier:'free', category:'visualization', focus:['custom-charts','data-binding','svg','interaction'] },
  { id:'stack-chartjs', name:'Chart.js', tier:'free', category:'visualization', focus:['canvas','common-charts','responsive','datasets'] },
  { id:'stack-recharts', name:'Recharts', tier:'free', category:'visualization', focus:['react','composable-charts','responsive','data'] },
  { id:'stack-echarts', name:'Apache ECharts', tier:'free', category:'visualization', focus:['large-datasets','interactive-charts','dashboard','visualization'] },
];

export const DI_RECIPES = [
  { id:'recipe-free-saas-dashboard', name:'Focused SaaS Analytics Dashboard', tier:'free', styleId:'style-minimalism', paletteId:'palette-slate-cyan', typographyId:'type-inter-inter', chartIds:['chart-kpi-line','chart-grouped-bar'], stackIds:['stack-react','stack-tailwind'], layout:'Persistent sidebar + KPI row + primary analytics panel', navigation:'Persistent sidebar', ux:['progressive disclosure','clear loading states','keyboard-visible focus'] },
  { id:'recipe-free-ai-workspace', name:'AI Developer Workspace', tier:'free', styleId:'style-dark-ui', paletteId:'palette-violet-indigo', typographyId:'type-space-inter', chartIds:['chart-kpi-line'], stackIds:['stack-react','stack-nextjs'], layout:'Command sidebar + main workspace + inspector rail', navigation:'Collapsible sidebar + command palette', ux:['keyboard-first actions','non-blocking feedback','reduced-motion support'] },

  { id:'recipe-free-healthcare-portal', name:'Calm Healthcare Portal', tier:'free', styleId:'style-minimalism', paletteId:'palette-health-teal', typographyId:'type-inter-inter', chartIds:[], stackIds:['stack-react','stack-nextjs'], layout:'Clear patient summary + next appointment + task list + readable forms', navigation:'Simple top navigation with a persistent account area', ux:['plain-language labels','visible validation errors','keyboard-friendly forms','no colour-only health statuses'] },
  { id:'recipe-free-commerce-story', name:'Editorial Commerce Story', tier:'free', styleId:'style-editorial', paletteId:'palette-rose-editorial', typographyId:'type-playfair-inter', chartIds:[], stackIds:['stack-nextjs','stack-tailwind'], layout:'Editorial hero + product story + curated grid + compact purchase summary', navigation:'Top navigation with collection paths and a clear cart action', ux:['visible price and shipping details','persistent purchase feedback','accessible image descriptions'] },
  { id:'recipe-free-mobile-habit', name:'Mobile Habit Companion', tier:'free', styleId:'style-claymorphism', paletteId:'palette-forest-sage', typographyId:'type-manrope-inter', chartIds:['chart-sparkline-kpi'], stackIds:['stack-react-native','stack-flutter'], layout:'Today summary + single primary action + progress cards + history list', navigation:'Bottom navigation with four clearly named destinations', ux:['44px-equivalent touch targets','reduced-motion support','offline-friendly state messaging'] },
  { id:'recipe-free-learning-workspace', name:'Learning Progress Workspace', tier:'free', styleId:'style-bento', paletteId:'palette-citrus-energy', typographyId:'type-plus-jakarta-inter', chartIds:['chart-kpi-line','chart-grouped-bar'], stackIds:['stack-react','stack-tailwind'], layout:'Course progress + continue-learning action + recent lessons + compact outcomes', navigation:'Course sidebar on wide layouts; stacked sections on mobile', ux:['clear progress text','keyboard access to lessons','do not rely on colour alone for status'] },
  { id:'recipe-free-finance-operations', name:'Finance Operations Overview', tier:'free', styleId:'style-data-dense', paletteId:'palette-ocean-blue', typographyId:'type-ibm-plex-mono-inter', chartIds:['chart-area-trend','chart-waterfall'], stackIds:['stack-react','stack-echarts'], layout:'Summary metrics + time-series trend + variance breakdown + reconciled activity table', navigation:'Persistent workspace navigation with explicit date/filter state', ux:['format units and periods','confirm destructive actions','explain data freshness and empty states'] },
  { id:'recipe-free-publication', name:'Long-form Publication', tier:'free', styleId:'style-mono-editorial', paletteId:'palette-graphite-mono', typographyId:'type-newsreader-dm', chartIds:[], stackIds:['stack-astro','stack-nextjs'], layout:'Readable article column + contents navigation + supporting related stories', navigation:'Compact top navigation with article contents on wide screens', ux:['comfortable line length','skip links','semantic article headings and landmarks'] },
];

export const ALL_DI_RECORDS = [
  ...DI_STYLES.map(record=>({ ...record, domain:'styles' })),
  ...DI_PALETTES.map(record=>({ ...record, domain:'palettes' })),
  ...DI_TYPOGRAPHY.map(record=>({ ...record, domain:'typography' })),
  ...DI_CHARTS.map(record=>({ ...record, domain:'charts' })),
  ...DI_STACKS.map(record=>({ ...record, domain:'stacks' })),
  ...DI_RECIPES.map(record=>({ ...record, domain:'recipes' })),
];
