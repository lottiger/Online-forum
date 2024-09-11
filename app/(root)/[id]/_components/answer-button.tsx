import React from 'react';
import { CiCircleCheck } from 'react-icons/ci';

const AnswerButton = ({ isAnswer, canToggle, category, onToggle }: AnswerButtonProps): JSX.Element => {
  const isQNA = category === 'QNA'; // Kontrollera om kategorin är QNA

  return (
    <div className='hover:text-green-700 duration-300'
      onClick={canToggle && isQNA ? onToggle : undefined}
      style={{ cursor: canToggle && isQNA ? 'pointer' : 'default' }}
    >
      {isAnswer ? (
        <CiCircleCheck style={{ fontSize: '1.3rem', color: 'green', fontWeight: 'bold' }} />
      ) : (
        <CiCircleCheck style={{ fontSize: '1.3rem' }} />
      )}
    </div>
  );
};

export default AnswerButton;
