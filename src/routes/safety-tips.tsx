import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  BellRing,
  Globe,
  KeyRound,
  Link2Off,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  UserCheck,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/safety-tips")({
  head: () => ({
    meta: [
      { title: "Safety Tips & Checklist — CyberSafe Community" },
      {
        name: "description",
        content:
          "Ten simple digital safety practices plus a quick safety checklist you can tick off as you protect your accounts.",
      },
      { property: "og:title", content: "Digital Safety Tips" },
      {
        property: "og:description",
        content: "Simple everyday habits that stop most online scams.",
      },
    ],
  }),
  component: SafetyTipsPage,
});

const tips = [
  {
    icon: KeyRound,
    title: "Never share OTP or PIN",
    text: "An OTP is like cash. No bank, wallet, delivery agent or government office will ever ask for it.",
  },
  {
    icon: LockKeyhole,
    title: "Use strong, unique passwords",
    text: "Use a long phrase with numbers and symbols, and a different password for each important account.",
  },
  {
    icon: ShieldCheck,
    title: "Enable two-factor authentication",
    text: "A second check after your password stops most account takeovers, even if the password leaks.",
  },
  {
    icon: Link2Off,
    title: "Avoid unknown links",
    text: "Do not tap links from unknown numbers or unexpected messages. Open the official app instead.",
  },
  {
    icon: Wallet,
    title: "Verify payment requests",
    text: "Confirm with the person on a known number before paying. Receiving money never needs your PIN.",
  },
  {
    icon: RefreshCw,
    title: "Keep software updated",
    text: "Updates close the security holes attackers use. Turn on automatic updates on your phone.",
  },
  {
    icon: UserCheck,
    title: "Avoid sharing sensitive information",
    text: "Do not post your ID documents, tickets, card photos or full date of birth on social media.",
  },
  {
    icon: Globe,
    title: "Check website addresses",
    text: "Read the full address carefully before entering credentials. Fake sites copy logos perfectly.",
  },
  {
    icon: Smartphone,
    title: "Use official apps and websites",
    text: "Install apps only from official app stores and never from a link someone sends you.",
  },
  {
    icon: BellRing,
    title: "Report suspicious activity",
    text: "Tell your bank and the cybercrime helpline quickly. Fast reporting improves the chance of recovery.",
  },
] as const;

const checklist = [
  "I have never shared my OTP or PIN with anyone",
  "My important accounts use different, strong passwords",
  "Two-factor authentication is on for my email and banking",
  "My phone and apps are set to update automatically",
  "I know how to check a website address before logging in",
  "I only install apps from official app stores",
  "I know my bank's official helpline number",
  "I have told one family member about these habits",
] as const;

const STORAGE_KEY = "cybersafe-checklist";

function SafetyTipsPage() {
  const [checked, setChecked] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved) as string[]);
    } catch {
      /* ignore unreadable storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      /* ignore unwritable storage */
    }
  }, [checked, hydrated]);

  const completed = hydrated ? checked.length : 0;
  const percent = Math.round((completed / checklist.length) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Safety Tips"
        title="Get protected: everyday digital safety"
        description="Ten simple habits that stop almost every common online scam. Start with any one of them today."
      />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <div key={tip.title} className="surface-panel lift-on-hover p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <tip.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-base font-semibold">{tip.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{tip.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-2xl font-bold">Quick safety checklist</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tick the practices you already follow. Your progress stays on this device only.
          </p>

          <div className="surface-panel mt-6 p-6">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-success" aria-hidden="true" />
                {completed} of {checklist.length} completed
              </span>
              <span>{percent}%</span>
            </div>
            <Progress value={percent} className="mt-2" />

            <ul className="mt-6 space-y-3">
              {checklist.map((item) => {
                const isChecked = checked.includes(item);
                return (
                  <li key={item} className="flex items-start gap-3">
                    <Checkbox
                      id={item}
                      checked={isChecked}
                      onCheckedChange={(value) =>
                        setChecked((prev) =>
                          value === true ? [...prev, item] : prev.filter((entry) => entry !== item),
                        )
                      }
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={item}
                      className={`text-sm ${isChecked ? "text-muted-foreground line-through" : ""}`}
                    >
                      {item}
                    </label>
                  </li>
                );
              })}
            </ul>

            {completed === checklist.length && hydrated && (
              <p className="mt-6 rounded-xl border border-success/40 bg-success-soft p-4 text-sm font-medium text-success">
                Well done! You are following every practice on this checklist.
              </p>
            )}

            {completed > 0 && (
              <Button variant="outline" className="mt-6" onClick={() => setChecked([])}>
                Reset checklist
              </Button>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/quiz">Test yourself with the quiz</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/help">I need help with a scam</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
