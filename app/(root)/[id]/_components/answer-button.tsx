import React from 'react';
import { CiCircleCheck } from 'react-icons/ci';

interface AnswerButtonProps {
  isAnswer: boolean; // Är den här kommentaren markerad som svaret?
  canToggle: boolean; // Kan den inloggade användaren toggla statusen (endast trådskaparen)?
  onToggle: () => void; // Callback för att toggla markeringen
}

const AnswerButton: React.FC<AnswerButtonProps> = ({ isAnswer, canToggle, onToggle }) => {
  return (
    <div onClick={canToggle ? onToggle : undefined} style={{ cursor: canToggle ? 'pointer' : 'default' }}>
      {isAnswer ? (
        <CiCircleCheck style={{ fontSize: '1.3rem', color: 'hotpink', fontWeight: 'bold'}} />
      ) : (
        <CiCircleCheck style={{ fontSize: '1.3rem' }} />
      )}
    </div>
  );
};

export default AnswerButton;
