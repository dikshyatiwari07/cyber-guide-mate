import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  FileWarning,
  Loader2,
  MessageSquare,
  RefreshCw,
  ScanSearch,
  Star,
} from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { getCommunityStats, getDashboardData } from "@/lib/cybersafe.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Community Dashboard — CyberSafe Community" },
      {
        name: "description",
        content:
          "Prototype dashboard showing message checks, quiz attempts, reports and feedback collected by the CyberSafe Community project.",
      },
      { property: "og:title", content: "CyberSafe Community Dashboard" },
      {
        property: "og:description",
        content: "Live prototype statistics for our community awareness project.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const stats = useQuery({ queryKey: ["community-stats"], queryFn: () => getCommunityStats() });
  const recent = useQuery({ queryKey: ["dashboard-data"], queryFn: () => getDashboardData() });

  const loading = stats.isLoading || recent.isLoading;
  const failed = stats.isError || recent.isError;

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Community impact dashboard"
        description="Live data collected by this prototype. Numbers update as community members use the awareness tools."
      >
        <Button
          variant="outline"
          onClick={() => {
            stats.refetch();
            recent.refetch();
          }}
        >
          <RefreshCw className="mr-2 size-4" /> Refresh data
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-6xl px-4 py-12">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" /> Loading dashboard data…
          </div>
        )}

        {failed && (
          <div className="surface-panel border-destructive/40 bg-destructive-soft p-6 text-center">
            <p className="font-semibold text-destructive">
              The dashboard data could not be loaded right now.
            </p>
          </div>
        )}

        {stats.data && recent.data && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard
                icon={ScanSearch}
                label="Message checks"
                value={stats.data.messageChecks}
              />
              <StatCard icon={BarChart3} label="Quiz attempts" value={stats.data.quizAttempts} />
              <StatCard
                icon={BarChart3}
                label="Average quiz score"
                value={`${stats.data.averageQuizScore}%`}
              />
              <StatCard icon={FileWarning} label="Reports" value={stats.data.reports} />
              <StatCard
                icon={Star}
                label="Feedback"
                value={stats.data.feedbackCount}
                note={
                  stats.data.feedbackCount > 0
                    ? `Average rating ${stats.data.averageRating}/5`
                    : undefined
                }
              />
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Panel title="Recent message checks" icon={ScanSearch}>
                <EmptyOr count={recent.data.recentChecks.length} label="message checks">
                  {recent.data.recentChecks.map((row) => (
                    <li key={row.id} className="border-b border-border pb-3 last:border-0">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            row.risk_level === "Potential Scam"
                              ? "bg-destructive text-destructive-foreground"
                              : row.risk_level === "Be Careful"
                                ? "bg-warning text-warning-foreground"
                                : "bg-success text-success-foreground"
                          }`}
                        >
                          {row.risk_level}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(row.created_at)}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {row.message_text}
                      </p>
                      {row.detected_signs.length > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Signs: {row.detected_signs.join(", ")}
                        </p>
                      )}
                    </li>
                  ))}
                </EmptyOr>
              </Panel>

              <Panel title="Recent quiz attempts" icon={BarChart3}>
                <EmptyOr count={recent.data.recentAttempts.length} label="quiz attempts">
                  {recent.data.recentAttempts.map((row) => (
                    <li
                      key={row.id}
                      className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0"
                    >
                      <span className="font-medium">
                        {row.score}/{row.total_questions} · {Math.round(Number(row.percentage))}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(row.completed_at)}
                      </span>
                    </li>
                  ))}
                </EmptyOr>
              </Panel>

              <Panel title="Recent reports" icon={FileWarning}>
                <EmptyOr count={recent.data.recentReports.length} label="reports">
                  {recent.data.recentReports.map((row) => (
                    <li key={row.id} className="border-b border-border pb-3 last:border-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium">{row.issue_type}</span>
                        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
                          {row.status}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {row.description}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(row.created_at)}
                      </p>
                    </li>
                  ))}
                </EmptyOr>
              </Panel>

              <Panel title="Recent feedback" icon={MessageSquare}>
                <EmptyOr count={recent.data.recentFeedback.length} label="feedback entries">
                  {recent.data.recentFeedback.map((row) => (
                    <li key={row.id} className="border-b border-border pb-3 last:border-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1 text-sm font-medium">
                          {row.rating}/5
                          <Star className="size-3.5 fill-warning text-warning" aria-hidden="true" />
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(row.created_at)}
                        </span>
                      </div>
                      {row.feedback && (
                        <p className="mt-1 text-sm text-muted-foreground">{row.feedback}</p>
                      )}
                    </li>
                  ))}
                </EmptyOr>
              </Panel>
            </div>
          </>
        )}

        <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
          Prototype dashboard for an academic Community Connect project. It shows anonymous
          awareness data only — no names, phone numbers or financial details are ever collected.
        </p>
      </section>
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof BarChart3;
  label: string;
  value: number | string;
  note?: string | undefined;
}) {
  return (
    <div className="surface-panel p-5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof BarChart3;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-panel p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyOr({
  count,
  label,
  children,
}: {
  count: number;
  label: string;
  children: React.ReactNode;
}) {
  if (count === 0) {
    return <p className="py-6 text-sm text-muted-foreground">No {label} recorded yet.</p>;
  }
  return <ul className="space-y-3">{children}</ul>;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
