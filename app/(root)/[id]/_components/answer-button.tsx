import React from 'react';
import { CiCircleCheck } from "react-icons/ci";

interface AnswerButtonProps {
  isAnswer: boolean; // Är den här kommentaren markerad som svaret?
  onToggle: () => void; // Callback för att markera som svar
}

const AnswerButton: React.FC<AnswerButtonProps> = ({ isAnswer, onToggle }) => {
  return (
    <div onClick={onToggle} style={{ cursor: 'pointer' }}>
      {isAnswer ? (
        <CiCircleCheck style={{ fontSize: '1.3rem', color: 'green' }} />
      ) : (
        <CiCircleCheck style={{ fontSize: '1.3rem' }} />
      )}
    </div>
  );
};

export default AnswerButton;
