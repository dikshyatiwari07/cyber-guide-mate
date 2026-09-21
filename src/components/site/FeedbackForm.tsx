import { useServerFn } from "@tanstack/react-start";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitFeedback } from "@/lib/cybersafe.functions";

export function FeedbackForm() {
  const send = useServerFn(submitFeedback);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="surface-panel border-success/40 bg-success-soft p-6 text-center">
        <p className="text-lg font-semibold text-success">Thank you for your feedback!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          It has been saved and helps us improve our community awareness sessions.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setDone(false);
            setRating(0);
            setMessage("");
          }}
        >
          Send another response
        </Button>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (rating < 1) {
      toast.error("Please choose a rating from 1 to 5.");
      return;
    }
    setSending(true);
    try {
      await send({ data: { rating, feedback: message.trim() } });
      setDone(true);
    } catch {
      toast.error("Your feedback could not be saved. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-panel space-y-4 p-6">
      <div>
        <span className="text-sm font-medium">How helpful was this platform?</span>
        <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Rating from 1 to 5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onClick={() => setRating(value)}
              className="rounded-md p-1 transition-transform hover:scale-110"
            >
              <Star
                className={
                  value <= rating
                    ? "size-7 fill-warning text-warning"
                    : "size-7 text-muted-foreground"
                }
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="feedback-message" className="text-sm font-medium">
          Your feedback (optional)
        </label>
        <Textarea
          id="feedback-message"
          value={message}
          maxLength={1000}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="What did you find most useful? What should we add?"
          className="mt-2 min-h-24"
        />
      </div>

      <Button type="submit" disabled={sending}>
        {sending && <Loader2 className="mr-2 size-4 animate-spin" />}
        Submit feedback
      </Button>
    </form>
  );
}
