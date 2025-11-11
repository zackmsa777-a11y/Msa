import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors text-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-red-900/30">
        {language && (
          <div className="px-4 py-2 bg-black/40 text-red-400 text-xs font-mono border-b border-red-900/30">
            {language}
          </div>
        )}
        <pre className="p-4 overflow-x-auto">
          <code className="text-gray-100 text-sm font-mono leading-relaxed">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
