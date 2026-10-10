export type TierLevel = 'FREE' | 'STUDENT' | 'PRO' | 'INSTITUTIONAL';

export interface SubscriptionTier {
  id: TierLevel;
  name: string;
  priceTZS: number;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  limits: {
    maxProjects: number;
    aiTokens: number;
    storageMb: number;
  };
  highlighted?: boolean;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'FREE',
    name: 'Free Starter',
    priceTZS: 0,
    billingCycle: 'monthly',
    features: [
      'Basic Report Generation',
      '3 Specialized AI Tools',
      'Standard Support',
      'Export to PDF'
    ],
    limits: {
      maxProjects: 5,
      aiTokens: 10000,
      storageMb: 50
    }
  },
  {
    id: 'STUDENT',
    name: 'Student Essential',
    priceTZS: 9900,
    billingCycle: 'monthly',
    features: [
      'Access to all 9 AI Tools',
      'Advanced Citation Formatter',
      'Priority Email Support',
      'Export to Word & PDF'
    ],
    limits: {
      maxProjects: 15,
      aiTokens: 50000,
      storageMb: 200
    }
  },
  {
    id: 'PRO',
    name: 'Research Pro',
    priceTZS: 24900,
    billingCycle: 'monthly',
    highlighted: true,
    features: [
      'Unlimited Academic Tools',
      'Plagiarism formatting check',
      '1x1 Consultation Chat',
      'Premium Analytics'
    ],
    limits: {
      maxProjects: -1, // Unlimited
      aiTokens: 250000,
      storageMb: 1024
    }
  },
  {
    id: 'INSTITUTIONAL',
    name: 'University License',
    priceTZS: 450000,
    billingCycle: 'yearly',
    features: [
      'Dedicated Admin Dashboard',
      'Unlimited Student Seats',
      'Custom Branding Integration',
      'API Access & SSO'
    ],
    limits: {
      maxProjects: -1,
      aiTokens: -1,
      storageMb: 10240
    }
  }
];

// Mock for simulating current user state
export const getCurrentSubscription = () => {
  return {
    tier: SUBSCRIPTION_TIERS[0], // Free
    usage: {
      projects: 2,
      aiTokens: 4500,
      storageMb: 12
    }
  };
};
