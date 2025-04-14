import React from 'react';

interface Props {
  letter: string;
}

const LetterDisplay: React.FC<Props> = ({ letter }) => (
  <div className="mt-6 whitespace-pre-line bg-gray-50 p-4 rounded border">
    {letter}
  </div>
);

export default LetterDisplay;
