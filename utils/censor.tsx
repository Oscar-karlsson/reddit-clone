export function censorText(text: string): string {
  const censoredWords = ['badword1', 'badword2'];
  const words = text.split(' ');

  return words
    .map((word) => {
      if (censoredWords.includes(word.toLowerCase())) {
        return `<span class="censored" onclick="window.toggleCensor(this)">${word}</span>`;
      }
      return word;
    })
    .join(' ');
}

// Define the toggle function to show or hide the censored word
(window as any).toggleCensor = (element: HTMLElement) => {
  element.classList.toggle('revealed');
};
