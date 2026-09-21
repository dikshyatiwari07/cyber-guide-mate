import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Info, LifeBuoy, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitReport } from "@/lib/cybersafe.functions";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Need Help? Report an Incident — CyberSafe Community" },
      {
        name: "description",
        content:
          "Step-by-step actions to take if you suspect online fraud, plus a simple prototype form to record the incident.",
      },
      { property: "og:title", content: "Need Help With Online Fraud?" },
      {
        property: "og:description",
        content: "What to do first if you suspect a scam, and how to record the details.",
      },
    ],
  }),
  component: HelpPage,
});

const steps = [
  {
    title: "Stop communicating with the suspected scammer",
    text: "Do not reply, call back or continue the chat. Block the number or account.",
  },
  {
    title: "Do not share any additional information",
    text: "No OTP, PIN, password, card number or document, even if they insist they are officials.",
  },
  {
    title: "Contact your bank or payment provider immediately",
    text: "If money is involved, call the helpline printed on your card or inside the official app. Ask them to block the transaction and your card.",
  },
  {
    title: "Save screenshots and transaction details",
    text: "Keep the message, the number, the time and the transaction reference. This evidence supports your complaint.",
  },
  {
    title: "Report to the appropriate cybercrime authority",
    text: "File a complaint with your national or local cybercrime portal or helpline, and with your local police if needed.",
  },
] as const;

const issueTypes = [
  "Phishing message or email",
  "OTP fraud",
  "UPI or payment fraud",
  "Fake customer care call",
  "Social media scam or fake profile",
  "Malicious link or app",
  "Other online issue",
] as const;

function HelpPage() {
  const send = useServerFn(submitReport);
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!issueType) {
      toast.error("Please choose the type of issue.");
      return;
    }
    if (description.trim().length < 10) {
      toast.error("Please describe what happened in a little more detail.");
      return;
    }
    if (email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address or leave it empty.");
      return;
    }

    setSending(true);
    try {
      await send({
        data: { issueType, description: description.trim(), email: email.trim() },
      });
      setDone(true);
    } catch {
      toast.error("Your report could not be submitted. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Help"
        title="Need help?"
        description="If you suspect online fraud, act quickly and calmly. Follow these five steps, then record the details below."
      />

      <section className="mx-auto max-w-4xl px-4 py-12">
        <ol className="space-y-4">
          {steps.map((step, position) => (
            <li key={step.title} className="surface-panel flex gap-4 p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {position + 1}
              </span>
              <div>
                <h2 className="font-semibold">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <LifeBuoy className="size-6 text-primary" aria-hidden="true" />
            Report an incident
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Recording the details helps our community team understand which scams are spreading
            locally.
          </p>

          <div className="mt-4 flex gap-3 rounded-xl border border-warning/50 bg-warning-soft p-4 text-sm">
            <Info className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
            <p>
              Never enter your OTP, PIN, password, bank account number, card number or CVV in this
              form. We do not need them and will never ask for them.
            </p>
          </div>

          {done ? (
            <div className="surface-panel mt-6 border-success/40 bg-success-soft p-6 text-center">
              <CheckCircle2 className="mx-auto size-8 text-success" aria-hidden="true" />
              <p className="mt-3 text-lg font-semibold text-success">
                Your report has been submitted successfully.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Status: Submitted. This is a prototype reporting system for an academic project and
                does not automatically submit reports to government authorities — please also file
                a complaint with your official cybercrime helpline.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setDone(false);
                  setIssueType("");
                  setDescription("");
                  setEmail("");
                }}
              >
                Submit another report
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="surface-panel mt-6 space-y-5 p-6">
              <div>
                <label htmlFor="issue-type" className="text-sm font-medium">
                  Type of issue
                </label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger id="issue-type" className="mt-2">
                    <SelectValue placeholder="Choose the type of issue" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium">
                  What happened?
                </label>
                <Textarea
                  id="description"
                  value={description}
                  maxLength={2000}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the message or call, when it happened and what you were asked to do. Do not include OTPs, PINs or account numbers."
                  className="mt-2 min-h-32"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {description.length}/2000 characters
                </p>
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Email (optional)
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  maxLength={255}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Only if you would like our community team to follow up.
                </p>
              </div>

              <Button type="submit" disabled={sending}>
                {sending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Submit Report
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
