import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

/**
 * Creates a Supabase client that uses the public (publishable) key.
 * Row Level Security applies, so only the public policies are reachable.
 */
function getPublicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

/* ------------------------------------------------------------------ */
/* Awareness topics                                                    */
/* ------------------------------------------------------------------ */

export const getTopics = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("cyber_topics")
    .select("id, title, description, warning_signs, safety_tips, avoid_tips, icon, sort_order")
    .order("sort_order", { ascending: true });

  if (error) throw new Error("We could not load the awareness topics right now.");
  return data ?? [];
});

/* ------------------------------------------------------------------ */
/* Message checker (rule based awareness indicators)                   */
/* ------------------------------------------------------------------ */

const INDICATORS: { sign: string; weight: number; patterns: RegExp[] }[] = [
  {
    sign: "Asks for an OTP or verification code",
    weight: 3,
    patterns: [/\botp\b/i, /one[-\s]?time password/i, /verification code/i],
  },
  {
    sign: "Asks for a PIN, password or CVV",
    weight: 3,
    patterns: [/\bpin\b/i, /\bpassword\b/i, /\bcvv\b/i, /card number/i],
  },
  {
    sign: "Urgent or threatening language",
    weight: 2,
    patterns: [
      /urgent/i,
      /immediately/i,
      /right now/i,
      /within \d+ (hours?|minutes?)/i,
      /last warning/i,
      /final notice/i,
    ],
  },
  {
    sign: "Account blocked or suspended warning",
    weight: 2,
    patterns: [/account (is |will be )?(blocked|suspended|deactivat)/i, /account closure/i],
  },
  {
    sign: "KYC or document update request",
    weight: 3,
    patterns: [/\bkyc\b/i, /aadhaar/i, /\bpan card\b/i, /update your (details|documents)/i],
  },
  {
    sign: "Asks you to click or tap a link",
    weight: 1,
    patterns: [/click (here|this|the link)/i, /tap (here|this link)/i, /verify now/i, /login here/i],
  },
  {
    sign: "Prize, lottery or reward claim",
    weight: 2,
    patterns: [/\bprize\b/i, /\bwinner\b/i, /you have won/i, /\blottery\b/i, /\breward\b/i, /cashback/i],
  },
  {
    sign: "Mentions money, payment or refund",
    weight: 1,
    patterns: [/\bpayment\b/i, /\brefund\b/i, /bank account/i, /\bupi\b/i, /transfer( the)? money/i],
  },
  {
    sign: "Shortened or hidden link",
    weight: 3,
    patterns: [
      /\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly|rb\.gy|shorturl|ow\.ly)\b/i,
    ],
  },
  {
    sign: "Suspicious web address",
    weight: 2,
    patterns: [
      /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i,
      /https?:\/\/[^\s]*(-|\.)(verify|secure|update|kyc|login|bank)[^\s]*/i,
      /\.(xyz|top|icu|click|link|tk|zip)\b/i,
    ],
  },
  {
    sign: "Asks you to install or share your screen",
    weight: 3,
    patterns: [/install (this )?app/i, /\.apk\b/i, /screen share/i, /anydesk/i, /teamviewer/i, /quick ?support/i],
  },
  {
    sign: "Job or investment offer with upfront fee",
    weight: 2,
    patterns: [/registration fee/i, /processing fee/i, /work from home/i, /guaranteed (profit|return)/i],
  },
];

const ADVICE_BY_LEVEL: Record<string, string> = {
  "Potential Scam":
    "Do not click the link or share OTP, PIN or password. Verify the request through the organization's official website or app, and report it if money is involved.",
  "Be Careful":
    "Treat this message with caution. Do not share codes or personal details, and confirm the request through an official app, website or helpline number you already trust.",
  "Low Risk":
    "No common scam indicators were found, but still stay alert. Never share OTPs, PINs or passwords, and verify anything unexpected through official channels.",
};

export const checkMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        message: z
          .string()
          .trim()
          .min(5, "Please paste a slightly longer message.")
          .max(2000, "Please keep the message under 2000 characters."),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const text = data.message;

    let score = 0;
    const detected: string[] = [];
    for (const indicator of INDICATORS) {
      if (indicator.patterns.some((pattern) => pattern.test(text))) {
        detected.push(indicator.sign);
        score += indicator.weight;
      }
    }

    const riskLevel: "Low Risk" | "Be Careful" | "Potential Scam" =
      score >= 5 ? "Potential Scam" : score >= 2 ? "Be Careful" : "Low Risk";

    const result = {
      riskLevel,
      score,
      detectedSigns: detected,
      advice: ADVICE_BY_LEVEL[riskLevel]!,
    };

    // Store an anonymous record of the check for community statistics.
    try {
      const supabase = getPublicClient();
      await supabase.from("message_checks").insert({
        message_text: text.slice(0, 2000),
        risk_level: riskLevel,
        detected_signs: detected,
      });
    } catch (error) {
      console.error("Could not save message check", error);
    }

    return result;
  });

/* ------------------------------------------------------------------ */
/* Quiz                                                                */
/* ------------------------------------------------------------------ */

export const getQuizQuestions = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("id, question, option_a, option_b, option_c, option_d, correct_answer, explanation");

  if (error) throw new Error("We could not load the quiz questions right now.");

  const questions = [...(data ?? [])];
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j]!, questions[i]!];
  }
  return questions.slice(0, 5);
});

export const saveQuizAttempt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        score: z.number().int().min(0).max(50),
        totalQuestions: z.number().int().min(1).max(50),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const percentage = Math.round((data.score / data.totalQuestions) * 10000) / 100;
    const supabase = getPublicClient();
    const { error } = await supabase.from("quiz_attempts").insert({
      score: data.score,
      total_questions: data.totalQuestions,
      percentage,
    });
    if (error) throw new Error("Your score could not be saved. Please try again.");
    return { percentage };
  });

/* ------------------------------------------------------------------ */
/* Reports and feedback                                                */
/* ------------------------------------------------------------------ */

export const submitReport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        issueType: z.string().trim().min(2).max(100),
        description: z
          .string()
          .trim()
          .min(10, "Please describe what happened in a little more detail.")
          .max(2000),
        email: z.union([z.string().trim().email("Please enter a valid email address.").max(255), z.literal("")]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = getPublicClient();
    const { error } = await supabase.from("cyber_reports").insert({
      issue_type: data.issueType,
      description: data.description,
      email: data.email === "" ? null : data.email,
      status: "Submitted",
    });
    if (error) throw new Error("Your report could not be submitted. Please try again.");
    return { ok: true };
  });

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        rating: z.number().int().min(1).max(5),
        feedback: z.string().trim().max(1000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = getPublicClient();
    const { error } = await supabase.from("community_feedback").insert({
      rating: data.rating,
      feedback: data.feedback === "" ? null : data.feedback,
    });
    if (error) throw new Error("Your feedback could not be saved. Please try again.");
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Community / dashboard statistics                                    */
/* ------------------------------------------------------------------ */

export const getCommunityStats = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicClient();

  const [checks, attempts, reports, feedback, topics] = await Promise.all([
    supabase.from("message_checks").select("*", { count: "exact", head: true }),
    supabase.from("quiz_attempts").select("percentage"),
    supabase.from("cyber_reports").select("*", { count: "exact", head: true }),
    supabase.from("community_feedback").select("rating"),
    supabase.from("cyber_topics").select("*", { count: "exact", head: true }),
  ]);

  const percentages = (attempts.data ?? []).map((row) => Number(row.percentage));
  const ratings = (feedback.data ?? []).map((row) => row.rating);

  return {
    messageChecks: checks.count ?? 0,
    quizAttempts: percentages.length,
    averageQuizScore:
      percentages.length > 0
        ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
        : 0,
    reports: reports.count ?? 0,
    feedbackCount: ratings.length,
    averageRating:
      ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : 0,
    topics: topics.count ?? 0,
  };
});

export const getDashboardData = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicClient();

  const [checks, attempts, reports, feedback] = await Promise.all([
    supabase
      .from("message_checks")
      .select("id, message_text, risk_level, detected_signs, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("quiz_attempts")
      .select("id, score, total_questions, percentage, completed_at")
      .order("completed_at", { ascending: false })
      .limit(10),
    supabase
      .from("cyber_reports")
      .select("id, issue_type, description, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("community_feedback")
      .select("id, rating, feedback, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (checks.error || attempts.error || reports.error || feedback.error) {
    throw new Error("We could not load the dashboard data right now.");
  }

  return {
    recentChecks: checks.data ?? [],
    recentAttempts: attempts.data ?? [],
    recentReports: reports.data ?? [],
    recentFeedback: feedback.data ?? [],
  };
});
