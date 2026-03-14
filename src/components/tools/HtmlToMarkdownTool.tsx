"use client";

import { useCallback } from "react";
import TurndownService from "turndown";
import { InputOutput } from "@/components/InputOutput";

function htmlToMarkdown(html: string): string {
  if (!html.trim()) throw new Error("Please enter HTML to convert");
  const turndownService = new TurndownService();
  return turndownService.turndown(html);
}

export function HtmlToMarkdownTool() {
  const handleTransform = useCallback((input: string) => {
    return htmlToMarkdown(input);
  }, []);

  return (
    <InputOutput
      inputLabel="HTML"
      outputLabel="Markdown"
      inputPlaceholder="<h1>Hello</h1><p>Convert HTML to Markdown...</p>"
      outputPlaceholder="Markdown output will appear here..."
      onTransform={handleTransform}
    />
  );
}
