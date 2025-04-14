import * as React from 'react'

const LetterDisplay: React.FC<{ letter: string }> = ({ letter }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg border whitespace-pre-wrap font-mono text-sm text-gray-800">
      {letter}
    </div>
  )
}

export default LetterDisplay
