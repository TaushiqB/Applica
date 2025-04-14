// import React, { useRef, useState } from 'react'
// import { useGSAP } from '@gsap/react'
// import { gsap } from 'gsap'
// import PromptForm from './components/PromptForm'
// import LetterDisplay from './components/LetterDisplay'

// const App: React.FC = () => {
//   const container = useRef(null)
//   const [letter, setLetter] = useState('')

//   useGSAP(() => {
//     gsap.from(container.current, { opacity: 0, y: -40, duration: 1 })
//   })

//   const handleGenerate = async (resume: string, jobDesc: string, template: string) => {
//     const res = await fetch('/api/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ resume, jobDesc, template }),
//     })
//     const data = await res.json()
//     setLetter(data.letter)
//   }

//   return (
//     <div ref={container} className="min-h-screen bg-gray-50 px-6 py-10">
//       <h1 className="text-4xl font-bold text-center mb-8">Motivation Letter Generator</h1>
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6">
//         <PromptForm onGenerate={handleGenerate} />
//         {letter && <LetterDisplay letter={letter} />}
//       </div>
//     </div>
//   )
// }

// export default App



// src/App.tsx

import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import PromptForm from './components/PromptForm'
import LetterDisplay from './components/LetterDisplay'

interface ParsedData {
  resume: {
    personal_info: Record<string, string>
    education: Array<Record<string, string>>
    experience: Array<Record<string, any>>
    skills: string[]
  }
  job_description: {
    title: string
    company: string
    requirements: string[]
    responsibilities: string[]
    skills: string[]
  }
}

const App: React.FC = () => {
  const container = useRef<HTMLDivElement>(null)
  const [letter, setLetter] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useGSAP(() => {
    if (container.current) {
      gsap.from(container.current, { opacity: 0, y: -40, duration: 1 })
    }
  })

  const handleGenerate = async (
    resume: string,
    jobDesc: string,
    template: string
  ) => {
    setLoading(true)
    try {
      // 1️⃣ Extract structured data
      const extractRes = await fetch('http://localhost:8000/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, job_desc: jobDesc }),
      })
      if (!extractRes.ok) {
        throw new Error(`Extraction failed: ${extractRes.statusText}`)
      }
      const parsed: ParsedData = await extractRes.json()
      console.log('Parsed Data:', parsed)

      // 2️⃣ Build your generation payload
      const generatePayload = {
        template,
        // you can choose which fields to include in your prompt
        personal_info: parsed.resume.personal_info,
        education: parsed.resume.education,
        experience: parsed.resume.experience,
        resume_skills: parsed.resume.skills,
        job_title: parsed.job_description.title,
        job_company: parsed.job_description.company,
        job_requirements: parsed.job_description.requirements,
        job_responsibilities: parsed.job_description.responsibilities,
        job_skills: parsed.job_description.skills,
      }

      // 3️⃣ Call your existing /api/generate
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatePayload),
      })
      if (!genRes.ok) {
        throw new Error(`Generation failed: ${genRes.statusText}`)
      }
      const genData = await genRes.json()
      setLetter(genData.letter)
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={container} className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-8">
        Motivation Letter Generator
      </h1>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <PromptForm onGenerate={handleGenerate} />
        {loading && <p className="text-center">Loading…</p>}
        {letter && <LetterDisplay letter={letter} />}
      </div>
    </div>
  )
}

export default App

