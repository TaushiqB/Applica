import * as React from 'react'
import { useState } from 'react'

interface Props {
  onGenerate: (resume: string, jobDesc: string, template: string) => void
}

const PromptForm: React.FC<Props> = ({ onGenerate }) => {
  const [resume, setResume] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [template, setTemplate] = useState('default')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate(resume, jobDesc, template)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        placeholder="Paste your resume here..."
        value={resume}
        onChange={e => setResume(e.target.value)}
        className="w-full border rounded p-3 h-32 resize-y"
      />
      <textarea
        placeholder="Paste the job description here..."
        value={jobDesc}
        onChange={e => setJobDesc(e.target.value)}
        className="w-full border rounded p-3 h-32 resize-y"
      />
      <select
        value={template}
        onChange={e => setTemplate(e.target.value)}
        className="w-full border rounded p-3"
      >
        <option value="default">Default</option>
        <option value="formal">Formal</option>
        <option value="creative">Creative</option>
      </select>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
      >
        Generate
      </button>
    </form>
  )
}

export default PromptForm
