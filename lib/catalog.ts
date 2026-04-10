import {
  articles as seedArticles,
  type NewsArticle,
  type NewsSection,
  navSections,
} from '@/data/newsSiteData';

export const PAGE_SIZE = 10;

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=70',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=70',
  'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&w=800&q=70',
  'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800&q=70',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=70',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=70',
];

const HEADLINES: Record<NewsSection, string[]> = {
  News: [
    'City Hall readies winter shelter expansion as demand rises',
    'Regional transit board reviews overnight safety pilot metrics',
    'County health officials track seasonal respiratory trends',
    'Voters weigh bond package for school modernization projects',
    'Emergency managers stage multi-agency river flood drill',
  ],
  Sports: [
    'Conference standings tighten after weekend road swing',
    'Rookie class shows depth in preseason conditioning reports',
    'Arena district merchants prepare for playoff foot traffic',
    'Coaching staff emphasizes two-way play in practice film',
    'Injury updates ahead of rivalry week draw fan scrutiny',
  ],
  Business: [
    'Small-business lending windows adjust to rate environment',
    'Regional banks highlight deposit stability in earnings call',
    'Downtown office conversions spark appraisal methodology debate',
    'Supply chain partners test AI-assisted demand forecasting',
    'Consumer sentiment index edges up in latest metro survey',
  ],
  Entertainment: [
    'Festival organizers announce expanded local artist slots',
    'Venue operators test hybrid seating for mid-size tours',
    'Streaming bundles reshape promotion calendars for indies',
    'Critics preview fall slate of documentary premieres',
    'Box office analysts watch holdover strength vs. new releases',
  ],
  Lifestyle: [
    'Design studios spotlight adaptable floor plans for renters',
    'Farmers markets add weekday hours to ease crowding',
    'Wellness programs expand employer-sponsored coaching pilots',
    'Neighborhood walks program maps new public art installations',
    'Home cooks drive interest in compact appliance test kitchens',
  ],
  Tech: [
    'Engineering teams document governance patterns for AI copilots',
    'City IT leaders weigh open standards for civic dashboards',
    'Hardware startups demo low-power sensors for civic infrastructure',
    'Security researchers share red-team findings on SSO flows',
    'Open-source maintainers outline long-term support commitments',
  ],
  Opinion: [
    'Editorial: transparency builds trust in procurement decisions',
    'Guest essay: why local newsrooms need sustainable subscription models',
    'Column: measured growth beats hype in civic technology rollouts',
    'Opinion: schools deserve predictable capital planning cycles',
    'Reader forum: ideas for safer nighttime transit corridors',
  ],
};

function placeholderArticle(section: NewsSection, index: number): NewsArticle {
  const headlines = HEADLINES[section];
  const title = `${headlines[index % headlines.length]} (${section} wire ${index + 1})`;
  const slug = `${section.toLowerCase()}-wire-${String(index + 1).padStart(4, '0')}`;
  return {
    slug,
    section,
    title,
    summary:
      'Placeholder copy for layout, pagination, and ad integration. Replace with wire service or CMS content when available.',
    content: [
      'This is placeholder body copy. It exists so paginated URLs render unique, indexable HTML before your editorial pipeline is connected.',
      'Editors can swap this module for API-driven stories without changing routing or infinite-scroll behavior.',
    ],
    author: 'Wire Desk',
    readTime: '2 min read',
    publishedAt: `Apr ${1 + (index % 28)}, 2026`,
    imageUrl: IMAGE_POOL[index % IMAGE_POOL.length],
  };
}

function buildCatalog(): NewsArticle[] {
  const placeholders: NewsArticle[] = [];
  for (const section of navSections) {
    for (let i = 0; i < 22; i += 1) {
      placeholders.push(placeholderArticle(section, i));
    }
  }
  const bySlug = new Map<string, NewsArticle>();
  for (const a of [...seedArticles, ...placeholders]) {
    bySlug.set(a.slug, a);
  }
  return Array.from(bySlug.values());
}

const catalog: NewsArticle[] = buildCatalog();

export function getAllArticles(): NewsArticle[] {
  return catalog;
}

export function getArticleBySlug(slug?: string): NewsArticle | undefined {
  if (!slug) return undefined;
  return catalog.find((a) => a.slug === slug);
}

export function sectionFromSlug(slug: string): NewsSection | null {
  const map: Record<string, NewsSection> = {
    news: 'News',
    sports: 'Sports',
    business: 'Business',
    entertainment: 'Entertainment',
    lifestyle: 'Lifestyle',
    tech: 'Tech',
    opinion: 'Opinion',
  };
  return map[slug.toLowerCase()] ?? null;
}

export function slugForSection(section: NewsSection): string {
  return section.toLowerCase();
}

export function filterBySection(section: NewsSection): NewsArticle[] {
  return catalog.filter((a) => a.section === section);
}

export function parsePage(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const n = parseInt(v ?? '1', 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return n;
}

export function getFeedPage(section: NewsSection, page: number): {
  items: NewsArticle[];
  total: number;
  totalPages: number;
  page: number;
} {
  const pool = filterBySection(section);
  const total = pool.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const items = pool.slice(start, start + PAGE_SIZE);
  return { items, total, totalPages, page: safePage };
}

export function hasMorePages(section: NewsSection, page: number): boolean {
  const pool = filterBySection(section);
  const totalPages = Math.max(1, Math.ceil(pool.length / PAGE_SIZE));
  return page < totalPages;
}
