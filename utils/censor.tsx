import React from 'react';

export function censorText(text: string): string {
  const censoredWords = ['badword1', 'badword2'];
  const words = text.split(' ');

  return words
    .map((word) => {
      if (censoredWords.includes(word.toLowerCase())) {
        return `<span class="censored" onclick="(function() { this.classList.toggle('revealed'); }).call(this)">${word}</span>`;
      }
      return word;
    })
    .join(' ');
}

export function CensorComponent({ text }: { text: string }) {
  // Render the censored text
  return <div dangerouslySetInnerHTML={{ __html: censorText(text) }} />;
}