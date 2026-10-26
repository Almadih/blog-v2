"use client";
import Markdown from "react-markdown";
import { CodeBlock } from "react-code-block";
import { Prism } from "prism-react-renderer";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import Mermaid from "./mermaid";

// Register additional Prism languages not bundled by default in prism-react-renderer
if (typeof globalThis !== "undefined") {
  (globalThis as unknown as { Prism: typeof Prism }).Prism = Prism;
  try {
    require("prismjs/components/prism-bash");
    require("prismjs/components/prism-dart");
    require("prismjs/components/prism-markup-templating");
    require("prismjs/components/prism-php");
    Prism.languages.shell = Prism.languages.bash;
  } catch {
    // Graceful fallback if dynamic require is unavailable
  }
}

function CodeBlockWithCopy({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950/90 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-zinc-900/40 text-xs font-mono text-zinc-400">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
          </div>
          <span className="ml-2 text-zinc-400 text-[11px] uppercase tracking-wider">
            {language || "code"}
          </span>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="inline-flex items-center space-x-1.5 px-2 py-1 rounded-md text-[11px] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <CodeBlock
        code={code}
        language={language === "shell" ? "bash" : (language?.toLowerCase() || "text")}
        prism={Prism}
      >
        <CodeBlock.Code className="p-4 sm:p-5 overflow-x-auto text-[13px] sm:text-sm font-mono leading-relaxed block">
          <div className="table-row">
            <CodeBlock.LineNumber className="table-cell pr-4 text-xs text-zinc-400 text-right select-none" />
            <CodeBlock.LineContent className="table-cell text-zinc-200">
              <CodeBlock.Token />
            </CodeBlock.LineContent>
          </div>
        </CodeBlock.Code>
      </CodeBlock>
    </div>
  );
}

export default function MarkdownComponent({ content }: { content: string }) {
  return (
    <Markdown
      components={{
        hr() {
          return <hr className="my-10 border-white/[0.08]" />;
        },

        code(props) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          if (match && match[0] === "language-mermaid") {
            return <Mermaid chart={codeString} />;
          }

          if (match) {
            return (
              <CodeBlockWithCopy
                code={codeString}
                language={match[1]}
              />
            );
          }

          return (
            <code
              {...rest}
              className="text-[13px] font-mono text-zinc-200 bg-white/[0.06] border border-white/[0.08] px-1.5 py-0.5 rounded"
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
}
