import React from 'react';
import { CiCircleCheck } from 'react-icons/ci';

interface AnswerButtonProps {
  isAnswer: boolean; // Är den här kommentaren markerad som svaret?
  canToggle: boolean; // Kan den inloggade användaren toggla statusen (endast trådskaparen)?
  category: string; // Lägg till trådens kategori för att kontrollera om det är en QNA-tråd
  onToggle: () => void; // Callback för att toggla markeringen
}

const AnswerButton: React.FC<AnswerButtonProps> = ({ isAnswer, canToggle, category, onToggle }) => {
  const isQNA = category === 'QNA'; // Kontrollera om kategorin är QNA

  return (
    <div
      onClick={canToggle && isQNA ? onToggle : undefined}
      style={{ cursor: canToggle && isQNA ? 'pointer' : 'default' }}
    >
      {isAnswer ? (
        <CiCircleCheck style={{ fontSize: '1.3rem', color: 'hotpink', fontWeight: 'bold' }} />
      ) : (
        <CiCircleCheck style={{ fontSize: '1.3rem' }} />
      )}
    </div>
  );
};

export default AnswerButton;
