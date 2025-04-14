import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import PromptForm from './components/PromptForm';
import LetterDisplay from './components/LetterDisplay';

interface GenerateResponse {
  letter: string;
}


const App: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const [letter, setLetter] = useState<string>('');

  useGSAP(() => {
    if (container.current) {
      gsap.from(container.current, { opacity: 0, y: -50, duration: 1 });
    }
  }, { scope: container });

  const handleGenerate = async (
    resume: string,
    jobDesc: string,
    template: string
  ) => {
    try {
      const res = await axios.post<GenerateResponse>('/api/generate', {
        resume,
        jobDesc,
        template,
      });
      setLetter(res.data.letter);
    } catch (error) {
      console.error('Axios error');
    }
  };

  return (
    <div ref={container} className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Motivation Letter Generator
      </h1>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <PromptForm onGenerate={handleGenerate} />
        {letter && <LetterDisplay letter={letter} />}
      </div>
    </div>
  );
};

export default App;
