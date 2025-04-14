import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import PromptForm from './components/PromptForm'
import LetterDisplay from './components/LetterDisplay'

const App: React.FC = () => {
  const container = useRef(null)
  const [letter, setLetter] = useState('')

  useGSAP(() => {
    gsap.from(container.current, { opacity: 0, y: -40, duration: 1 })
  })

  const handleGenerate = async (resume: string, jobDesc: string, template: string) => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, jobDesc, template }),
    })
    const data = await res.json()
    setLetter(data.letter)
  }

  return (
    <div ref={container} className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-8">Motivation Letter Generator</h1>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <PromptForm onGenerate={handleGenerate} />
        {letter && <LetterDisplay letter={letter} />}
      </div>
    </div>
  )
}

export default App
