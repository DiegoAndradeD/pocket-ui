import { useState, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { formatCode } from "../lib/helpers";
import { CheckIcon, CopyIcon } from "./icons";

interface ComponentCardProps {
  title: string;
  description: string;
  children: ReactNode;
  code?: string;
}

export function ComponentCard({
  title,
  description,
  children,
  code,
}: ComponentCardProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const formattedCode = code ? formatCode(code) : "";

  const copyToClipboard = () => {
    if (!formattedCode) return;
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 mb-12 w-full max-w-3xl">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>

        {code && (
          <div className="flex items-center gap-1 border-b border-border pb-2 mt-2">
            <button
              onClick={() => setActiveTab("preview")}
              className={cn(
                "text-sm px-3 py-1.5 rounded-md transition-colors cursor-pointer",
                activeTab === "preview"
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={cn(
                "text-sm px-3 py-1.5 rounded-md transition-colors cursor-pointer",
                activeTab === "code"
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              Code
            </button>
          </div>
        )}
      </div>

      {activeTab === "preview" ? (
        <div className="min-h-50 w-full rounded-xl border border-border bg-background p-6 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 dark:opacity-40" />
          </div>
          <div className="w-full relative z-10 flex flex-col gap-6 items-center justify-center">
            {children}
          </div>
        </div>
      ) : (
        <div className="relative group w-full rounded-xl border border-border bg-[#0d1117] p-4 overflow-x-auto">
          <button
            onClick={copyToClipboard}
            className={cn(
              "absolute right-3 top-3 p-2 rounded-md border border-border/20 bg-muted/10 text-muted-foreground",
              "hover:bg-muted/20 hover:text-foreground transition-all duration-200 cursor-pointer",
              "opacity-0 group-hover:opacity-100 focus:opacity-100",
              copied &&
                "text-green-500 border-green-500/50 bg-green-500/10 opacity-100",
            )}
            title="Copy code"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <CopyIcon className="w-4 h-4" />
            )}
          </button>

          <pre className="text-[13px] text-[#c9d1d9] font-mono leading-relaxed pr-10">
            <code>{formattedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
