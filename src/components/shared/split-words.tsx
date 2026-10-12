import type { CSSProperties } from 'react';

interface SplitWordsProps {
  text: string;
  /** Delay before the first word starts to rise, in milliseconds. */
  startDelayMs?: number;
  /** Gap between consecutive words, in milliseconds. */
  stepMs?: number;
}

/**
 * Splits a headline into words that rise out of a mask. Pure CSS, so the text is present in the
 * server HTML, and the spaces stay outside the masks so the browser still wraps lines naturally.
 */
export function SplitWords({ text, startDelayMs = 0, stepMs = 60 }: SplitWordsProps) {
  const words = text.split(' ');

  return (
    <>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="word-mask">
            <span
              className="word"
              style={{ '--delay': `${startDelayMs + index * stepMs}ms` } as CSSProperties}
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  );
}
