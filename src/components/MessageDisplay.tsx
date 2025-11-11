import { Message } from '../lib/supabase';
import { CodeBlock } from './CodeBlock';

interface MessageDisplayProps {
  message: Message;
}

export function MessageDisplay({ message }: MessageDisplayProps) {
  const renderContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: JSX.Element[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        parts.push(
          <div key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {textBefore}
          </div>
        );
      }

      const language = match[1] || 'text';
      const code = match[2].trim();
      parts.push(<CodeBlock key={`code-${match.index}`} code={code} language={language} />);

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      const textAfter = content.substring(lastIndex);
      parts.push(
        <div key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {textAfter}
        </div>
      );
    }

    return parts.length > 0 ? parts : <div className="whitespace-pre-wrap">{content}</div>;
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-red-900/30 text-white border border-red-700/50'
            : 'bg-gray-800/50 text-gray-100 border border-gray-700/50'
        }`}
      >
        <div className="text-xs text-gray-400 mb-1 font-semibold">
          {isUser ? 'You' : 'WormGPT'}
        </div>
        <div className="text-sm leading-relaxed">{renderContent(message.content)}</div>
      </div>
    </div>
  );
}
