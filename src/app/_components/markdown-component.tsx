"use client";
import Markdown from "react-markdown";
import { CodeBlock } from "react-code-block";

export default function MarkdownComponent({ content }: { content: string }) {
  return (
    <Markdown
      components={{
        hr() {
          return <div className="h-[2px] bg-white/10 my-4"></div>;
        },
        code(props) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <CodeBlock code={String(children)} language={match[1]}>
              <CodeBlock.Code className="bg-gray-900 p-6 rounded-xl shadow-lg overflow-auto text-base">
                <div className="table-row">
                  <CodeBlock.LineNumber className="table-cell pr-4 text-sm text-gray-500 text-right select-none" />
                  <CodeBlock.LineContent className="table-cell">
                    <CodeBlock.Token />
                  </CodeBlock.LineContent>
                </div>
              </CodeBlock.Code>
            </CodeBlock>
          ) : (
            <code {...rest} className={className}>
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
