export type NewsSection =
  | 'News'
  | 'Sports'
  | 'Business'
  | 'Entertainment'
  | 'Lifestyle'
  | 'Tech'
  | 'Opinion';

export interface NewsArticle {
  slug: string;
  section: NewsSection;
  title: string;
  summary: string;
  content: string[];
  author: string;
  readTime: string;
  publishedAt: string;
  imageUrl: string;
}

export const navSections: NewsSection[] = [
  'News',
  'Sports',
  'Business',
  'Entertainment',
  'Lifestyle',
  'Tech',
  'Opinion',
];

export const articles: NewsArticle[] = [
  {
    slug: 'metro-council-approves-night-transit-expansion',
    section: 'News',
    title: 'Metro Council Approves Night Transit Expansion Across Downtown Corridors',
    summary:
      'The new pilot extends service past midnight on six major routes, with city leaders pointing to worker demand and post-event mobility.',
    content: [
      'City leaders approved a six-month nighttime transit pilot that extends bus frequency until 1:30 a.m. on high-traffic routes. Officials said the effort supports hospital staff, hospitality workers, and residents returning from late events.',
      'Transportation planners said they expect the pilot to reduce ride-hailing surge costs and improve safety outcomes near entertainment districts. Real-time route dashboards and rider feedback tools are expected to launch alongside the service changes.',
      'The transit authority will publish monthly updates on ridership, on-time performance, and neighborhood-level usage to determine whether the program becomes permanent.',
    ],
    author: 'Elena Brooks',
    readTime: '5 min read',
    publishedAt: 'Apr 8, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'local-club-surges-after-playoff-deadline-deals',
    section: 'Sports',
    title: 'Local Club Surges in Standings After Aggressive Playoff Deadline Deals',
    summary:
      'A revamped midfield and deeper bench have shifted expectations, with analysts now projecting a top-three finish.',
    content: [
      'After a quiet first half of the season, the front office made two major deadline acquisitions that immediately changed the team’s tactical flexibility.',
      'Coaches credited the improved pressing shape and late-game substitutions for a three-match unbeaten run. Players said the locker room has embraced a faster transition style.',
      'With a critical road stretch ahead, the club faces its strongest test yet against division rivals with top defensive metrics.',
    ],
    author: 'Marcus Reed',
    readTime: '4 min read',
    publishedAt: 'Apr 8, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'regional-banks-race-to-modernize-digital-lending',
    section: 'Business',
    title: 'Regional Banks Race to Modernize Digital Lending as Competition Intensifies',
    summary:
      'Smaller institutions are retooling mobile onboarding and credit workflows to retain younger borrowers.',
    content: [
      'Regional lenders are investing in automated underwriting and digital identity checks to shorten approval windows from days to hours.',
      'Industry analysts say customer expectations now mirror fintech products, pushing traditional institutions to redesign legacy loan journeys.',
      'Executives noted that modernization remains a margin-sensitive effort, with long-term gains tied to retention and lower operating overhead.',
    ],
    author: 'Priya Khatri',
    readTime: '6 min read',
    publishedAt: 'Apr 7, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'studio-slate-shifts-to-shorter-theatrical-windows',
    section: 'Entertainment',
    title: 'Major Studio Slate Shifts to Shorter Theatrical Windows for Summer Releases',
    summary:
      'Studios are balancing box office momentum with streaming growth through tighter release schedules.',
    content: [
      'Entertainment executives announced revised distribution plans that shorten the gap between theater and platform debut for selected mid-budget films.',
      'Box office strategists say blockbuster franchises remain theater-first, while genre titles will move faster to digital audiences.',
      'The move is expected to increase marketing efficiency by combining theatrical campaigns with streaming conversion windows.',
    ],
    author: 'Jordan Lee',
    readTime: '3 min read',
    publishedAt: 'Apr 7, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'neighborhood-design-trend-prioritizes-multiuse-homes',
    section: 'Lifestyle',
    title: 'Neighborhood Design Trend Prioritizes Multiuse Homes and Walkable Blocks',
    summary:
      'Architects report rising demand for layouts that combine work, family, and recreation in compact footprints.',
    content: [
      'Developers are introducing homes with modular interiors that shift from office to guest space in minutes, reflecting remote and hybrid work patterns.',
      'Urban planners say proximity to grocery, school, and transit remains a leading factor for first-time buyers and growing families.',
      'Design firms expect demand for adaptable floor plans to expand as affordability pressures reshape renovation priorities.',
    ],
    author: 'Nora Alvarez',
    readTime: '5 min read',
    publishedAt: 'Apr 6, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'open-source-ai-tools-enter-mainstream-enterprise-workflows',
    section: 'Tech',
    title: 'Open-Source AI Tools Enter Mainstream Enterprise Workflows at Faster Pace',
    summary:
      'Engineering teams are combining open models with private data controls to move experimentation into production.',
    content: [
      'Technology leaders say open-source AI adoption has accelerated as deployment tooling matures and model hosting options expand.',
      'Security teams remain focused on audit trails, prompt governance, and policy checks before broad rollouts across sensitive operations.',
      'Industry observers expect hybrid stacks to dominate in the near term, with closed and open models serving different reliability and cost profiles.',
    ],
    author: 'Daniel Kim',
    readTime: '7 min read',
    publishedAt: 'Apr 8, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'editorial-why-civic-trust-starts-with-local-reporting',
    section: 'Opinion',
    title: 'Editorial: Why Civic Trust Still Starts With Strong Local Reporting',
    summary:
      'Communities rely on public-interest journalism to connect policy decisions with everyday impact.',
    content: [
      'Opinion editors argue that trust in institutions improves when reporting remains consistent, transparent, and grounded in local context.',
      'The editorial board called for expanded public-record access and stronger support for newsroom collaborations across metro areas.',
      'When audiences see how decisions affect schools, transit, and housing at neighborhood level, civic participation rises.',
    ],
    author: 'Editorial Board',
    readTime: '4 min read',
    publishedAt: 'Apr 5, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80',
  },
];

export const featuredSlides = articles.slice(0, 4);
export const trendingStories = articles.slice(1, 6);
export const mostReadStories = [...articles].reverse().slice(0, 5);
export const sponsoredStories = [
  {
    title: 'Partner Insight: 2026 Smart Infrastructure Outlook',
    sponsor: 'Urban Grid Forum',
  },
  {
    title: 'How Mid-Market Teams Scale Digital Subscriptions',
    sponsor: 'NorthRiver Media Lab',
  },
  {
    title: 'Data Briefing: Consumer Trends in Emerging Metro Areas',
    sponsor: 'Crestline Research',
  },
];

export const getArticleBySlug = (slug?: string) =>
  articles.find((article) => article.slug === slug);
