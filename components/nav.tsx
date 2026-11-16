"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Menu, X, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/content/site-data";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Originals" },
  { href: "/experience", label: "Journey" },
  { href: "/about", label: "About" },
  { href: "/certifications", label: "Credentials" },
  { href: "/skills", label: "Skills" },
  { href: "/resume", label: "Resume" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 font-display leading-none", className)}>
      <span className="text-[1.9em] text-primary">{site.brandLetter}</span>
      <span className="text-[0.8em] tracking-[0.35em] text-foreground/80">SERIES</span>
    </span>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const home = pathname === "/";

  React.useEffect(() => setOpen(false), [pathname]);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !home || scrolled || open;

  return (
    <header
      className={cn(
        "top-0 z-50 w-full transition-colors duration-300",
        home ? "fixed" : "sticky",
        solid
          ? "border-b border-border bg-background/95 backdrop-blur"
          : "bg-gradient-to-b from-black/80 to-transparent bg-no-repeat"
      )}
    >
      <div className="container flex h-16 items-center gap-8">
        <Link href="/" aria-label={`${site.name}, home`} className="text-base">
          <Brand />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(pathname, l.href) ? "page" : undefined}
              className={cn(
                "relative py-1 text-sm transition-colors hover:text-foreground",
                isActive(pathname, l.href)
                  ? "font-medium text-foreground after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:bg-primary"
                  : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden rounded border border-white/30 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:border-white sm:inline-block"
          >
            Let&rsquo;s talk
          </Link>
          {home && (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("stream:profiles"))}
              className="inline-flex h-9 w-9 items-center justify-center rounded bg-primary text-primary-foreground transition-transform hover:scale-105"
              aria-label="Switch viewer profile"
              title="Switch viewer profile"
            >
              <Users className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-muted lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-border bg-background lg:hidden" aria-label="Mobile navigation">
          <div className="container flex flex-col py-2">
            {[...links, { href: "/contact", label: "Contact" }].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(pathname, l.href) ? "page" : undefined}
                className={cn(
                  "border-b border-border py-3.5 text-base last:border-0",
                  isActive(pathname, l.href) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
