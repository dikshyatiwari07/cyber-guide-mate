import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  ScanSearch,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { checkMessage } from "@/lib/cybersafe.functions";

export const Route = createFileRoute("/check-message")({
  head: () => ({
    meta: [
      { title: "Check a Suspicious Message — CyberSafe Community" },
      {
        name: "description",
        content:
          "Paste an SMS, WhatsApp message or email and see which common scam warning signs it contains.",
      },
      { property: "og:title", content: "Check a Suspicious Message" },
      {
        property: "og:description",
        content: "An awareness tool that highlights common scam indicators in a message.",
      },
    ],
  }),
  component: CheckMessagePage,
});

type Result = Awaited<ReturnType<typeof checkMessage>>;

const SAMPLE =
  "Your bank KYC has expired. Click this link immediately to verify your account: http://bit.ly/kyc-verify";

const riskStyles: Record<string, { box: string; badge: string; icon: typeof CheckCircle2 }> = {
  "Low Risk": {
    box: "border-success/40 bg-success-soft",
    badge: "bg-success text-success-foreground",
    icon: CheckCircle2,
  },
  "Be Careful": {
    box: "border-warning/50 bg-warning-soft",
    badge: "bg-warning text-warning-foreground",
    icon: AlertTriangle,
  },
  "Potential Scam": {
    box: "border-destructive/40 bg-destructive-soft",
    badge: "bg-destructive text-destructive-foreground",
    icon: ShieldAlert,
  },
};

function CheckMessagePage() {
  const run = useServerFn(checkMessage);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCheck(event: React.FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (text.length < 5) {
      toast.error("Please paste a slightly longer message to check.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await run({ data: { message: text } });
      setResult(data);
    } catch {
      toast.error("We could not check that message right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const style = result ? riskStyles[result.riskLevel]! : null;
  const RiskIcon = style?.icon ?? CheckCircle2;

  return (
    <>
      <PageHeader
        eyebrow="Check Message"
        title="Check a suspicious message"
        description="Paste an SMS, WhatsApp message, email or any other suspicious text. We will highlight the common scam warning signs it contains."
      />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex gap-3 rounded-xl border border-warning/50 bg-warning-soft p-4 text-sm">
          <Info className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
          <p>
            <strong className="font-semibold">Please do not paste confidential information.</strong>{" "}
            Remove names, phone numbers, account numbers, OTPs, PINs and passwords before
            checking. We only store the message text for awareness statistics.
          </p>
        </div>

        <form onSubmit={handleCheck} className="surface-panel mt-6 space-y-4 p-6">
          <div>
            <label htmlFor="message" className="text-sm font-medium">
              Suspicious message
            </label>
            <Textarea
              id="message"
              value={message}
              maxLength={2000}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={SAMPLE}
              className="mt-2 min-h-40"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <button
                type="button"
                className="font-medium text-primary hover:underline"
                onClick={() => setMessage(SAMPLE)}
              >
                Use an example message
              </button>
              <span>{message.length}/2000</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <ScanSearch className="mr-2 size-4" />
              )}
              Check Message
            </Button>
            {(message || result) && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setMessage("");
                  setResult(null);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>

        {loading && (
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Checking for common scam indicators…
          </p>
        )}

        {result && style && (
          <div className={`mt-8 rounded-2xl border p-6 ${style.box}`}>
            <div className="flex flex-wrap items-center gap-3">
              <RiskIcon className="size-6" aria-hidden="true" />
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${style.badge}`}
                role="status"
              >
                {result.riskLevel}
              </span>
            </div>

            <h2 className="mt-5 text-sm font-semibold uppercase tracking-wide">
              Warning signs detected
            </h2>
            {result.detectedSigns.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-sm">
                {result.detectedSigns.map((sign) => (
                  <li key={sign} className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm">No common scam indicators were found in this message.</p>
            )}

            <h2 className="mt-5 text-sm font-semibold uppercase tracking-wide">Advice</h2>
            <p className="mt-2 text-sm">{result.advice}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/help">I think I have been scammed</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/learn">Learn about this type of scam</Link>
              </Button>
            </div>
          </div>
        )}

        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
          This tool is an educational awareness aid. It uses basic rule-based indicators and is
          not a professional cybersecurity threat-detection engine. A “Low Risk” result does not
          guarantee a message is genuine.
        </p>
      </section>
    </>
  );
}
