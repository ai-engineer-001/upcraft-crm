export type OutreachStatus = 'Identified' | 'Contacted' | 'Replied' | 'In-Talks' | 'Converted' | 'Lost';

export interface OutreachRecord {
  id: string;
  status: OutreachStatus;
  startupName: string;
  founder: string;
  contactLink: string;
  contactPlatform: 'LinkedIn' | 'Twitter' | 'Email' | 'Other';
  techStack: string;
  problemType: string;
  specificIssue: string;
  auditLink: string;
  outreachDate: string;
  nextAction: string;
}

export const OUTREACH_STATUSES: OutreachStatus[] = [
  'Identified',
  'Contacted',
  'Replied',
  'In-Talks',
  'Converted',
  'Lost',
];

export const STATUS_COLORS: Record<OutreachStatus, string> = {
  'Identified': 'bg-muted text-muted-foreground',
  'Contacted': 'bg-info/20 text-info',
  'Replied': 'bg-warning/20 text-warning',
  'In-Talks': 'bg-primary/20 text-primary',
  'Converted': 'bg-success/20 text-success',
  'Lost': 'bg-destructive/20 text-destructive',
};

export const PLATFORM_ICONS: Record<string, string> = {
  'LinkedIn': 'linkedin',
  'Twitter': 'twitter',
  'Email': 'mail',
  'Other': 'link',
};
