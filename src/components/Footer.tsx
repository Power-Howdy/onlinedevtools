import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
              Tools
            </h3>
            <ul className="text-sm text-neutral-500 dark:text-neutral-400 space-y-1">
              <li>
                <Link href="/json-formatter" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link href="/jwt-decoder" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  JWT Decoder
                </Link>
              </li>
              <li>
                <Link href="/base64-encoder" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Base64 Encoder
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  All Tools
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Contact
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Questions or feedback?{" "}
              <a
                href="mailto:contact@example.com"
                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors underline"
              >
                giftedclan0305@gmail.com
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              About
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Built for developers who need quick, reliable tools. No sign-up, no tracking, no installation. All processing happens locally in your browser.
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
