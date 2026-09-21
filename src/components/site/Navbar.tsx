import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/learn", label: "Learn" },
  { to: "/check-message", label: "Check Message" },
  { to: "/safety-tips", label: "Safety Tips" },
  { to: "/quiz", label: "Quiz" },
  { to: "/help", label: "Help" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold">CyberSafe Community</span>
            <span className="block text-xs text-muted-foreground">
              Stay Safe. Stay Smart. Stay Secure.
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="ml-2">
            <Link to="/safety-tips">Get Protected</Link>
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link to="/safety-tips" onClick={() => setOpen(false)}>
                Get Protected
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
