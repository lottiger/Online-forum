// forbiddenWords.ts
export const forbiddenWords: string[] = [
    'fuck',
    'bitch',
    'jävlar',
    // Lägg till fler olämpliga ord här
  ];

  // Helper-funktion för att censurera kommentarer
export const censorComment = (text: string) => {
    let censoredText = text;
    forbiddenWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      censoredText = censoredText.replace(regex, '***'); // Ersätt olämpliga ord med stjärnor
    });
    return censoredText;
  };
  