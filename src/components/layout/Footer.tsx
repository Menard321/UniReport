import Link from "next/link";
import { BookOpenText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 text-muted-foreground pt-12 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <BookOpenText className="size-5 text-primary" />
              <span className="text-lg font-bold font-heading tracking-tight text-foreground">
                UniReportTZ
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Academic Reports, Built Around Your University. The intelligent standard for rigorous research across Tanzania.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground tracking-tight">Platform</h3>
            <Link href="/features" className="text-sm hover:text-primary transition-colors">Features</Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">About Us</Link>
            <Link href="/universities" className="text-sm hover:text-primary transition-colors">Institutions</Link>
            <Link href="/pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground tracking-tight">Resources</h3>
            <Link href="/help" className="text-sm hover:text-primary transition-colors">Help Center</Link>
            <Link href="/integrity" className="text-sm hover:text-primary transition-colors">Academic Integrity</Link>
            <Link href="/library" className="text-sm hover:text-primary transition-colors">Resource Library</Link>
            <Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact Support</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground tracking-tight">Legal</h3>
            <Link href="/terms" className="text-sm hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-sm hover:text-primary transition-colors">Privacy & Data</Link>
          </div>

        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground w-full text-center md:text-left">
            &copy; {new Date().getFullYear()} UniReportTZ Platform. Built for African Higher Education.
          </p>
        </div>
      </div>
    </footer>
  );
}
