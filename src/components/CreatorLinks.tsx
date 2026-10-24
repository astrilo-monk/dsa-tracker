import { ArrowUpRight } from "lucide-react";

const githubUrl = "https://github.com/astrilo-monk";
const linkedinUrl = "https://www.linkedin.com/in/astrilo/";

/** Small text link, sits in the top bar. */
export function CreatorHeader() {
  return (
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit Astrilo Monk on GitHub"
      className="hidden items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
    >
      GitHub
      <ArrowUpRight className="size-3.5" />
    </a>
  );
}

export function CreatorFooter() {
  return (
    <footer className="mt-auto border-t border-border pt-6 text-sm text-muted-foreground">
      <p>Hire me to unlock my full potential.</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          Connect with me on LinkedIn
          <ArrowUpRight className="size-3.5" />
        </a>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground sm:hidden"
        >
          GitHub
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </footer>
  );
}
