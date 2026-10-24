import { ExternalLink } from "lucide-react";

const githubUrl = "https://github.com/astrilo-monk";
const linkedinUrl = "https://www.linkedin.com/in/astrilo/";

export function CreatorHeader() {
  return (
    <div className="flex justify-end pr-14 lg:pr-0">
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Astrilo Monk on GitHub"
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card/80 px-3 py-2 text-sm text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground"
      >
        <ExternalLink className="h-4 w-4" />
        <span>GitHub</span>
      </a>
    </div>
  );
}

export function CreatorFooter() {
  return (
    <footer className="mt-auto border-t border-border pt-6 text-center text-sm text-muted-foreground">
      <p>
        Hire me to unlock my full potential. 
      </p>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80 hover:underline"
      >
        <ExternalLink className="h-4 w-4" />
        Connect with me on LinkedIn
      </a>
    </footer>
  );
}
