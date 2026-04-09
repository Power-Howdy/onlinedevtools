"use client";

const githubRepo = process.env.NEXT_PUBLIC_GITHUB_REPO;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-light-border bg-light-card/50 backdrop-blur-sm dark:border-dark-border dark:bg-dark-card/50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-primary mb-2">DevToolBox</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Free developer utilities for JSON formatting, encoding, timestamps, and more. All tools run in your
              browser with no installation required.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Navigate
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Home &amp; all tools
                </a>
              </li>
              {githubRepo && (
                <li>
                  <a
                    href={githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Source on GitHub
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Contact
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <li>
                <a href="mailto:giftedclan0305@gmail.com" className="hover:text-primary transition-colors underline">
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/coocoohive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors underline"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/giftedclan0305"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors underline"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.indiehackers.com/IndieHacker0228"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors underline"
                >
                  Indie Hackers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              About
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Built for developers who need quick, reliable tools. No sign-up, no tracking, no installation. Processing
              happens locally in your browser.
            </p>
            <p className="mt-3 text-sm">
              <a
                href="mailto:giftedclan0305@gmail.com?subject=Pro%20API%20Interest"
                className="text-primary/90 hover:text-primary underline"
              >
                Need API access? Pro coming soon
              </a>
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-light-border dark:border-dark-border text-sm text-slate-500 dark:text-slate-400 text-center flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>© {new Date().getFullYear()} Online Dev Tools. All tools are free to use.</span>
          {githubRepo && (
            <>
              <span aria-hidden>·</span>
              <a
                href={githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors underline"
              >
                GitHub
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
