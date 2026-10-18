import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { SUBSCRIPTION_TIERS } from "@/lib/subscriptions";
import { getSystemPricing } from "@/lib/pricing-service";
import { BillingInteractive } from "./BillingInteractive";

export default async function BillingDashboard() {
  const session = await getSession();
  if (!session || !session.userId) redirect("/auth/login");

  const [user, documents, transactions, pricing] = await Promise.all([
    db.user.findUnique({
      where: { id: session.userId as string },
      include: { subscription: true }
    }),
    db.document.findMany({
      where: { userId: session.userId as string },
      orderBy: { updatedAt: "desc" },
      take: 20
    }),
    db.paymentTransaction.findMany({
      where: { userId: session.userId as string },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    getSystemPricing()
  ]);

  if (!user || !user.subscription) redirect("/auth/login");
  const sub = user.subscription;

  // Determine active plan tier details
  const currentTierMeta = SUBSCRIPTION_TIERS.find(t => t.id === sub.tier) || SUBSCRIPTION_TIERS[0];
  const isProOrSemester = sub.tier === "PRO" || sub.tier === "INSTITUTIONAL";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
          Document Downloads & Billing
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Access your defense-ready PDF & Word exports, unlock draft reports via mobile money, and review your payment receipts.
        </p>
      </div>

      <BillingInteractive 
        currentTierId={sub.tier}
        currentTierName={currentTierMeta.name}
        isProOrSemester={isProOrSemester}
        subProjectsUsed={sub.projectsUsed}
        subTokensUsed={sub.aiTokensUsed}
        subStorageMb={sub.storageUsedMb}
        documents={documents.map(d => ({
          id: d.id,
          title: d.title,
          toolType: d.toolType,
          isPaid: Boolean((d as any).isPaid),
          targetPages: d.targetPages,
          createdAt: d.createdAt.toISOString(),
          updatedAt: d.updatedAt.toISOString(),
        }))}
        transactions={transactions.map(tx => ({
          id: tx.id,
          reference: tx.reference,
          amount: tx.amount,
          currency: tx.currency,
          provider: tx.provider,
          tier: tx.tier,
          status: tx.status,
          phone: tx.phone,
          createdAt: tx.createdAt.toISOString()
        }))}
        singleReportPrice={pricing.singleDocumentExportTzs}
        semesterPassPrice={pricing.semesterPassTzs}
      />
    </div>
  );
}
