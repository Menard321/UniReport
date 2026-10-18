export type TierLevel = 'FREE' | 'STUDENT' | 'PRO' | 'INSTITUTIONAL';

export interface SubscriptionTier {
  id: TierLevel;
  name: string;
  priceTZS: number;
  billingCycle: 'monthly' | 'yearly' | 'lifetime' | 'semester';
  features: string[];
  limits: {
    maxProjects: number;
    aiTokens: number;
    storageMb: number;
  };
  highlighted?: boolean;
  subtitle?: string;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'FREE',
    name: 'Free Preview',
    subtitle: 'Free draft generation & review',
    priceTZS: 0,
    billingCycle: 'monthly',
    features: [
      'Free report generation across all 22 universities',
      'Full on-screen draft inspection',
      'University chapter outline customization',
      'Standard academic formatting',
      'Watermarked preview'
    ],
    limits: {
      maxProjects: 3,
      aiTokens: 25000,
      storageMb: 50
    }
  },
  {
    id: 'STUDENT',
    name: 'Single Report Unlock',
    subtitle: 'Instant one-time document pass',
    priceTZS: 5000,
    billingCycle: 'lifetime',
    features: [
      'Official watermark-free PDF & Word (.docx) export',
      'Official university cover page & signature block',
      'Instant M-Pesa / Tigo Pesa / Airtel Money activation',
      'Lifetime re-download & edit access from dashboard',
      'Zero recurring monthly charges'
    ],
    limits: {
      maxProjects: 10,
      aiTokens: 100000,
      storageMb: 250
    }
  },
  {
    id: 'PRO',
    name: 'Semester All-Access Pass',
    subtitle: 'Best for final-year students (FYP + Fieldwork)',
    priceTZS: 15000,
    billingCycle: 'semester',
    highlighted: true,
    features: [
      'Unlimited document unlocks across all 4 tools',
      'Field Reports + FYP Dissertation + Lab Reports + Coursework',
      'Advanced IEEE, APA 7th & Vancouver citation audits',
      'Interactive AI drafting & notes polishing assistant',
      'Defense preparation checklist & rubrics'
    ],
    limits: {
      maxProjects: -1, // Unlimited
      aiTokens: 500000,
      storageMb: 1024
    }
  },
  {
    id: 'INSTITUTIONAL',
    name: 'Institutional License',
    subtitle: 'For universities, colleges & departments',
    priceTZS: 450000,
    billingCycle: 'yearly',
    features: [
      'Dedicated Faculty / Department Admin Dashboard',
      'Unlimited Student & Supervisor Seats',
      'Custom Faculty Guidelines & Grading Rubrics pre-loaded',
      'Institutional Compliance Analytics & Audit Reports',
      'Dedicated Account Manager & Priority SLA'
    ],
    limits: {
      maxProjects: -1,
      aiTokens: -1,
      storageMb: 10240
    }
  }
];
