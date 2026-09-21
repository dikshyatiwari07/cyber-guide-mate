import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BookOpen,
  Lock,
  ScanSearch,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";

import shieldArt from "@/assets/cyber-shield.png";
import { Button } from "@/components/ui/button";
import { FeedbackForm } from "@/components/site/FeedbackForm";
import { getCommunityStats } from "@/lib/cybersafe.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CyberSafe Community — Stay Safe. Stay Smart. Stay Secure." },
      {
        name: "description",
        content:
          "Learn simple cybersecurity practices, check suspicious messages and protect yourself from common online scams.",
      },
      { property: "og:title", content: "CyberSafe Community" },
      {
        property: "og:description",
        content: "Simple cybersecurity awareness for everyone.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: BookOpen,
    title: "Learn",
    text: "Learn about common cyber threats in plain, simple language.",
    to: "/learn",
    cta: "Explore topics",
  },
  {
    icon: ScanSearch,
    title: "Check",
    text: "Check suspicious messages using our awareness-based detection tool.",
    to: "/check-message",
    cta: "Check a message",
  },
  {
    icon: Lock,
    title: "Protect",
    text: "Follow simple digital safety practices you can start today.",
    to: "/safety-tips",
    cta: "See safety tips",
  },
] as const;

function Home() {
  const { data: stats } = useQuery({
    queryKey: ["community-stats"],
    queryFn: () => getCommunityStats(),
  });

  const statCards = [
    {
      icon: Users,
      label: "People Reached",
      value: "500+",
      note: "Demo value for this prototype",
    },
    {
      icon: AlertTriangle,
      label: "Cyber Threats Explained",
      value: `${stats?.topics ?? 6}+`,
      note: "Live count from our database",
    },
    {
      icon: ShieldCheck,
      label: "Quiz Attempts",
      value: stats ? `${Math.max(stats.quizAttempts, 0)}` : "—",
      note: "Live count from our database",
    },
    {
      icon: Smartphone,
      label: "Messages Checked",
      value: stats ? `${stats.messageChecks}` : "—",
      note: "Live count from our database",
    },
  ];

  return (
    <>
      <section className="hero-gradient border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary shadow-sm">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Community cybersecurity awareness
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Stay Safe. Stay Smart. Stay Secure.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Learn simple cybersecurity practices and protect yourself from common online
              scams.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/learn">Learn Cyber Safety</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/check-message">Check a Suspicious Message</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={shieldArt}
              alt="Illustration of a security shield with a padlock, a smartphone and a warning sign"
              width={1024}
              height={1024}
              className="w-full max-w-sm drop-shadow-sm md:max-w-md"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="surface-panel lift-on-hover flex flex-col p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-xl font-semibold">{feature.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{feature.text}</p>
              <Button asChild variant="link" className="mt-3 self-start px-0">
                <Link to={feature.to}>{feature.cta} →</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold">Our community impact</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Prototype statistics. The awareness counts below update live from the project
            database; the outreach figure is a demo value from our community sessions.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <div key={stat.label} className="surface-panel p-5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <stat.icon className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-3xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Why cybersecurity matters</h2>
            <p className="mt-3 text-muted-foreground">
              Most of us now pay bills, talk to family and store documents on a phone. Scammers
              rarely break technology — they trick people. A single shared OTP or one tapped link
              can empty a savings account built over years.
            </p>
            <p className="mt-3 text-muted-foreground">
              The good news: a few simple habits stop almost every common scam. This project
              shares those habits in plain language so anyone in the community — students,
              parents, shopkeepers and grandparents — can stay protected.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/safety-tips">Get Protected</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/quiz">Test your knowledge</Link>
              </Button>
            </div>
          </div>
          <div className="surface-panel p-6">
            <h3 className="text-lg font-semibold">Three habits that stop most scams</h3>
            <ol className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success-soft text-sm font-bold text-success">
                  1
                </span>
                <span>
                  <strong className="font-semibold">Never share an OTP or PIN.</strong> No bank,
                  wallet or delivery company will ever ask for it.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success-soft text-sm font-bold text-success">
                  2
                </span>
                <span>
                  <strong className="font-semibold">Slow down when rushed.</strong> Urgency is a
                  scam tool. Pause and verify through an official app.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success-soft text-sm font-bold text-success">
                  3
                </span>
                <span>
                  <strong className="font-semibold">Do not tap unknown links.</strong> Type the
                  website name yourself instead.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section id="feedback" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-2xl font-bold">Community feedback</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Did this awareness platform help you? Your rating helps us improve future community
            sessions.
          </p>
          <div className="mt-6">
            <FeedbackForm />
          </div>
        </div>
      </section>
    </>
  );
}
