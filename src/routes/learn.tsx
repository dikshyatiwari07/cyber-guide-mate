import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/site/PageHeader";
import { TopicIcon } from "@/components/site/TopicIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTopics } from "@/lib/cybersafe.functions";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn Cyber Safety — CyberSafe Community" },
      {
        name: "description",
        content:
          "Understand phishing, OTP fraud, UPI scams, fake customer care calls, social media scams and malicious links in simple language.",
      },
      { property: "og:title", content: "Learn Cyber Safety" },
      {
        property: "og:description",
        content: "Six common cyber threats explained simply, with warning signs and what to do.",
      },
    ],
  }),
  component: LearnPage,
});

type Topic = Awaited<ReturnType<typeof getTopics>>[number];

function LearnPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cyber-topics"],
    queryFn: () => getTopics(),
  });
  const [selected, setSelected] = useState<Topic | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title="Learn cyber safety"
        description="Six of the most common online scams in our community, explained in plain language. Tap any card to see the warning signs and exactly what to do."
      />

      <section className="mx-auto max-w-6xl px-4 py-12">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Loading awareness topics…
          </div>
        )}

        {isError && (
          <div className="surface-panel border-destructive/40 bg-destructive-soft p-6 text-center">
            <p className="font-semibold text-destructive">
              We could not load the awareness topics.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        )}

        {data && data.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">
            No awareness topics have been added yet.
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setSelected(topic)}
              className="surface-panel lift-on-hover flex flex-col p-6 text-left"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <TopicIcon name={topic.icon} className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{topic.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{topic.description}</p>
              <span className="mt-4 text-sm font-medium text-primary">View details →</span>
            </button>
          ))}
        </div>
      </section>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <TopicIcon name={selected.icon} className="size-5 text-primary" />
                  {selected.title}
                </DialogTitle>
                <DialogDescription className="text-left text-base">
                  {selected.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 pt-2">
                <DetailList
                  title="Warning signs"
                  items={selected.warning_signs}
                  tone="warning"
                  icon={AlertTriangle}
                />
                <DetailList
                  title="What to do"
                  items={selected.safety_tips}
                  tone="success"
                  icon={CheckCircle2}
                />
                <DetailList
                  title="What NOT to do"
                  items={selected.avoid_tips}
                  tone="danger"
                  icon={XCircle}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailList({
  title,
  items,
  tone,
  icon: Icon,
}: {
  title: string;
  items: string[];
  tone: "warning" | "success" | "danger";
  icon: typeof AlertTriangle;
}) {
  const styles = {
    warning: "border-warning/40 bg-warning-soft text-warning-foreground",
    success: "border-success/30 bg-success-soft",
    danger: "border-destructive/30 bg-destructive-soft",
  }[tone];

  const iconColor = {
    warning: "text-warning",
    success: "text-success",
    danger: "text-destructive",
  }[tone];

  if (items.length === 0) return null;

  return (
    <div className={`rounded-xl border p-4 ${styles}`}>
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className={`size-4 ${iconColor}`} aria-hidden="true" />
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
