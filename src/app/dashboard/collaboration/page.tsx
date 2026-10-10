import { Users, UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CollaborationPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
            <Users className="size-8 text-primary" /> Peer Collaboration
          </h1>
          <p className="text-muted-foreground mt-1">
            Share research datasets, co-author academic reports, and collaborate with university peers.
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="size-4" /> Invite Collaborator
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto my-8">
        <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/40 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="size-8" />
        </div>
        <h3 className="text-lg font-bold mb-2">Academic Workspace Sync</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Multi-user real-time report editing and peer feedback modules are active for verified institution accounts.
        </p>
      </div>
    </div>
  );
}
