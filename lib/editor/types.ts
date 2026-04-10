export type WorkflowState = 'draft' | 'review' | 'legal' | 'approved' | 'published';

export type FeedSource = 'api' | 'data' | 'markets' | 'ai';

export type FeedItem = {
  id: string;
  source: FeedSource;
  title: string;
  summary: string;
  timestamp: string;
  entities: string[];
  severity: 'low' | 'medium' | 'high';
  context: string;
};

export type ArticleDraft = {
  id: string;
  title: string;
  body: string;
  markdown: string;
  status: WorkflowState;
  owner: string;
  entities: string[];
  citations: { id: string; label: string; url: string }[];
  updatedAt: string;
  versions: { id: string; timestamp: string; author: string; note: string }[];
  blockComments: { id: string; blockId: string; author: string; message: string; timestamp: string }[];
};

export type AnalyticsSnapshot = {
  articleViews: number;
  engagementMinutes: number;
  ctr: number;
  trending: { title: string; views: number; trend: 'up' | 'down' }[];
  activeTopics: { topic: string; score: number }[];
  clusters: { cluster: string; velocity: number; category: string }[];
  marketCorrelation: { entity: string; correlation: number }[];
};

export type AiActionResult = {
  title: string;
  content: string;
  bullets: string[];
};
