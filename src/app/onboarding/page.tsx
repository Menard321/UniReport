"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpenText, CheckCircle2, ChevronRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="border-b bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpenText className="size-5 text-primary" />
          <span className="font-bold font-heading text-lg text-primary dark:text-white">UniReportTZ</span>
        </div>
        <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          Step {step} of 3
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-sm border p-8 md:p-10">
          
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="mb-8">
                <GraduationCap className="size-12 text-teal-600 mb-4" />
                <h1 className="text-2xl font-bold font-heading text-foreground mb-2">Welcome! Let's set up your profile.</h1>
                <p className="text-muted-foreground">Select your institution so we can tailor guidelines to your specific university standards.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Institution / University</label>
                  <select className="w-full h-11 px-3 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value="" disabled selected>Select your University</option>
                    <option value="udsm">University of Dar es Salaam (UDSM)</option>
                    <option value="udom">University of Dodoma (UDOM)</option>
                    <option value="sua">Sokoine University of Agriculture (SUA)</option>
                    <option value="aru">Ardhi University (ARU)</option>
                    <option value="ifm">Institute of Finance Management (IFM)</option>
                    <option value="other">Other / Not Listed</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Faculty / School</label>
                  <input type="text" placeholder="e.g., College of ICT" className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>

              <div className="pt-6">
                <Button onClick={() => setStep(2)} className="w-full h-12 text-base font-medium">
                  Continue Form
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="mb-8">
                <h1 className="text-2xl font-bold font-heading text-foreground mb-2">Academic Details</h1>
                <p className="text-muted-foreground">This helps the AI reference engine determine the correct depth and citation requirements.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Study Level</label>
                  <select className="w-full h-11 px-3 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value="" disabled selected>Select level</option>
                    <option value="certificate">Certificate</option>
                    <option value="diploma">Diploma</option>
                    <option value="undergraduate">Bachelor's Degree (Undergraduate)</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD / Doctorate</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Programme / Course</label>
                  <input type="text" placeholder="e.g., BSc. in Computer Science" className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="w-1/3 h-12">Back</Button>
                <Button onClick={() => setStep(3)} className="w-2/3 h-12 text-base font-medium">
                  Continue
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="mb-8 items-center flex flex-col text-center">
                <CheckCircle2 className="size-16 text-teal-600 mb-4" />
                <h1 className="text-2xl font-bold font-heading text-foreground mb-2">You're All Set!</h1>
                <p className="text-muted-foreground">Your academic workspace is ready. You can change these preferences later in your settings.</p>
              </div>

              <div className="space-y-4 bg-muted/30 p-4 rounded-xl text-sm border">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Default Engine Language</span>
                  <span className="font-semibold">English (UK)</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Default Referencing</span>
                  <span className="font-semibold">APA 7th Edition</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">These defaults are applied across your institution.</p>
              </div>

              <div className="pt-6">
                <Link href="/dashboard">
                  <Button className="w-full h-12 text-base font-medium bg-teal-600 hover:bg-teal-500 text-white border-none shadow">
                    Enter the Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
