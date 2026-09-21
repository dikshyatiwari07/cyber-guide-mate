import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getQuizQuestions, saveQuizAttempt } from "@/lib/cybersafe.functions";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Cyber Awareness Quiz — CyberSafe Community" },
      {
        name: "description",
        content:
          "Take a free 5-question cybersecurity awareness quiz. No login needed, with an explanation after every answer.",
      },
      { property: "og:title", content: "Cyber Awareness Quiz" },
      {
        property: "og:description",
        content: "Five quick questions to test your online safety knowledge.",
      },
    ],
  }),
  component: QuizPage,
});

type Question = Awaited<ReturnType<typeof getQuizQuestions>>[number];
type Choice = "a" | "b" | "c" | "d";

function QuizPage() {
  const [attemptKey, setAttemptKey] = useState(0);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["quiz-questions", attemptKey],
    queryFn: () => getQuizQuestions(),
    gcTime: 0,
  });

  const save = useServerFn(saveQuizAttempt);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Choice>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  function restart() {
    setAnswers({});
    setRevealed({});
    setIndex(0);
    setSubmitted(false);
    setAttemptKey((value) => value + 1);
  }

  if (isLoading) {
    return (
      <>
        <PageHeader eyebrow="Quiz" title="Cyber awareness quiz" />
        <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" /> Preparing your questions…
        </div>
      </>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Quiz" title="Cyber awareness quiz" />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <p className="font-semibold text-destructive">
            The quiz questions could not be loaded right now.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </>
    );
  }

  const questions: Question[] = data;
  const total = questions.length;
  const score = questions.filter((q) => answers[q.id] === q.correct_answer).length;

  if (submitted) {
    const percentage = Math.round((score / total) * 100);
    const verdict =
      percentage >= 80
        ? "Excellent! You can help others in your community stay safe too."
        : percentage >= 50
          ? "Good start. Review the safety tips to close the remaining gaps."
          : "Worth another look — spend a few minutes on the learning cards and try again.";

    return (
      <>
        <PageHeader eyebrow="Quiz" title="Your quiz result" />
        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="surface-panel p-8 text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Your Score
            </p>
            <p className="mt-2 text-5xl font-bold text-primary">
              {score}/{total}
            </p>
            <p className="mt-3 text-muted-foreground">{verdict}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={restart}>
                <RotateCcw className="mr-2 size-4" /> Try another set
              </Button>
              <Button asChild variant="outline">
                <Link to="/safety-tips">See safety tips</Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {questions.map((question, position) => {
              const chosen = answers[question.id];
              const correct = chosen === question.correct_answer;
              return (
                <div
                  key={question.id}
                  className={`surface-panel p-5 ${
                    correct ? "border-success/40" : "border-destructive/40"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {position + 1}. {question.question}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm">
                    {correct ? (
                      <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                    ) : (
                      <XCircle className="size-4 text-destructive" aria-hidden="true" />
                    )}
                    <span>
                      Your answer:{" "}
                      {chosen ? optionText(question, chosen) : "Not answered"}
                    </span>
                  </p>
                  {!correct && (
                    <p className="mt-1 text-sm text-success">
                      Correct answer: {optionText(question, question.correct_answer as Choice)}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">{question.explanation}</p>
                </div>
              );
            })}
          </div>
        </section>
      </>
    );
  }

  const question = questions[index]!;
  const chosen = answers[question.id];
  const isRevealed = revealed[question.id] === true;
  const isCorrect = chosen === question.correct_answer;

  async function handleSubmit() {
    setSaving(true);
    try {
      await save({ data: { score, totalQuestions: total } });
      toast.success("Your attempt has been saved to the community statistics.");
    } catch {
      toast.error("Your score could not be saved, but here is your result.");
    } finally {
      setSaving(false);
      setSubmitted(true);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Quiz"
        title="Cyber awareness quiz"
        description="Five questions, picked randomly each time. No login needed — you get an explanation after every answer."
      />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {index + 1} of {total}
          </span>
          <span>{Object.keys(answers).length} answered</span>
        </div>
        <Progress value={((index + 1) / total) * 100} className="mt-2" />

        <div className="surface-panel mt-6 p-6">
          <h2 className="text-lg font-semibold">{question.question}</h2>

          <div className="mt-5 space-y-3">
            {(["a", "b", "c", "d"] as Choice[]).map((key) => {
              const selected = chosen === key;
              const showCorrect = isRevealed && key === question.correct_answer;
              const showWrong = isRevealed && selected && !isCorrect;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={isRevealed}
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, [question.id]: key }));
                    setRevealed((prev) => ({ ...prev, [question.id]: true }));
                  }}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm transition-colors ${
                    showCorrect
                      ? "border-success/50 bg-success-soft"
                      : showWrong
                        ? "border-destructive/50 bg-destructive-soft"
                        : selected
                          ? "border-primary bg-primary-soft"
                          : "border-border bg-card hover:border-primary/50 hover:bg-accent"
                  }`}
                >
                  <span className="font-semibold uppercase">{key}</span>
                  <span className="flex-1">{optionText(question, key)}</span>
                  {showCorrect && <CheckCircle2 className="size-5 text-success" />}
                  {showWrong && <XCircle className="size-5 text-destructive" />}
                </button>
              );
            })}
          </div>

          {isRevealed && (
            <div
              className={`mt-5 rounded-xl border p-4 text-sm ${
                isCorrect
                  ? "border-success/40 bg-success-soft"
                  : "border-warning/50 bg-warning-soft"
              }`}
            >
              <p className="font-semibold">{isCorrect ? "Correct!" : "Not quite."}</p>
              <p className="mt-1">{question.explanation}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            disabled={index === 0}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
          >
            Previous
          </Button>

          {index < total - 1 ? (
            <Button disabled={!isRevealed} onClick={() => setIndex((value) => value + 1)}>
              Next
            </Button>
          ) : (
            <Button disabled={!isRevealed || saving} onClick={handleSubmit}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Submit Quiz
            </Button>
          )}
        </div>
      </section>
    </>
  );
}

function optionText(question: Question, key: Choice) {
  return {
    a: question.option_a,
    b: question.option_b,
    c: question.option_c,
    d: question.option_d,
  }[key];
}
