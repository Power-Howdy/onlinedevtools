export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Online Dev Tools
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Free developer utilities for JSON formatting, encoding, timestamp conversion, and more. All tools run in your browser with no installation required.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Contact
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              Questions or feedback?{" "}
              
            </p>
            <ul className="text-sm text-neutral-500 dark:text-neutral-400 space-y-1">
              <li>
              <a
                href="mailto:giftedclan0305@gmail.com"
                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors underline"
              >
                Email
              </a>
              </li>
              <li>
                <a
                  href="https://x.com/coocoohive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors underline"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/giftedclan0305"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors underline"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.indiehackers.com/IndieHacker0228"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors underline"
                >
                  Indie Hackers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              About
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Built for developers who need quick, reliable tools. No sign-up, no tracking, no installation. All processing happens locally in your browser.
            </p>
            <p className="mt-2 text-sm">
              <a
                href="mailto:giftedclan0305@gmail.com?subject=Pro%20API%20Interest"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
              >
                Need API access? Pro coming soon
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-sm text-neutral-500 dark:text-neutral-400 text-center">
          © {new Date().getFullYear()} Online Dev Tools. All tools are free to use.
        </div>
      </div>
    </footer>
  );
}
