import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>
              <span className="font-bold">CyberSafe Community</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Simple cybersecurity awareness for everyone. A Community Connect initiative by
              B.Tech Information Technology students.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/learn" className="hover:text-primary">
                  Learn cyber safety
                </Link>
              </li>
              <li>
                <Link to="/check-message" className="hover:text-primary">
                  Check a suspicious message
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-primary">
                  Take the awareness quiz
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-primary">
                  Need help?
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary">
                  Community dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Disclaimer</h3>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              This website is an educational cybersecurity awareness prototype. The message
              checker uses basic rule-based indicators and should not be considered a
              professional cybersecurity detection system. Never share OTPs, passwords, PINs,
              banking credentials or other confidential information.
            </p>
          </div>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} CyberSafe Community · Educational prototype
        </p>
      </div>
    </footer>
  );
}
