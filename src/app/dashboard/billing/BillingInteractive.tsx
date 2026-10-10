"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/lib/subscriptions";
import { TzPaymentGateway } from "@/components/billing/TzPaymentGateway";

export function BillingInteractive({ currentTierId }: { currentTierId: string }) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier | null>(null);

  const handleUpgradeClick = (tier: SubscriptionTier) => {
    if (tier.id === currentTierId || tier.priceTZS === 0) return;
    setSelectedPlan(tier);
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-bold mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isCurrent = currentTierId === tier.id;
            const priceLabel = tier.priceTZS === 0 ? "Free forever" : new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(tier.priceTZS);

            return (
              <div 
                key={tier.id} 
                className={`relative flex flex-col rounded-2xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden ${tier.highlighted ? 'border-primary ring-1 ring-primary' : ''}`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 left-0 w-full bg-primary text-primary-foreground text-xs font-bold text-center py-1 uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className={`p-6 flex-1 flex flex-col ${tier.highlighted ? 'pt-8' : ''}`}>
                  <h3 className="font-bold text-lg">{tier.name}</h3>
                  <div className="mt-4 mb-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black">{priceLabel}</span>
                    {tier.priceTZS > 0 && <span className="text-sm text-muted-foreground">/{tier.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 h-10">
                    {tier.limits.maxProjects === -1 ? 'Unlimited' : tier.limits.maxProjects} Projects, {tier.limits.storageMb}MB Storage.
                  </p>
                  
                  <div className="space-y-3 flex-1 mb-8">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant={isCurrent ? "outline" : tier.highlighted ? "default" : "secondary"}
                    className="w-full"
                    disabled={isCurrent}
                    onClick={() => handleUpgradeClick(tier)}
                  >
                    {isCurrent ? "Current Plan" : tier.priceTZS === 0 ? "Downgrade" : "Upgrade Plan"}
                    {!isCurrent && tier.priceTZS > 0 && <Zap className="size-4 ml-2 fill-current opacity-50" />}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPlan && (
        <TzPaymentGateway 
          planName={selectedPlan.name}
          amount={selectedPlan.priceTZS}
          onSuccess={() => {
            setSelectedPlan(null);
            alert(`Payment Successful! Your plan will synchronize shortly.`);
            // Future step: A real API call to upgrade tier
            window.location.reload();
          }}
          onCancel={() => setSelectedPlan(null)}
        />
      )}
    </>
  );
}
