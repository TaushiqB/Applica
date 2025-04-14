import React, { useState } from 'react';

interface Props {
  onGenerate: (resume: string, jobDesc: string, template: string) => void;
}

const PromptForm: React.FC<Props> = ({ onGenerate }) => {
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [template, setTemplate] = useState('default');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(resume, jobDesc, template);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="font-medium">Resume</span>
        <textarea
          className="mt-1 block w-full border rounded p-2"
          rows={6}
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="font-medium">Job Description</span>
        <textarea
          className="mt-1 block w-full border rounded p-2"
          rows={6}
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="font-medium">Template</span>
        <select
          className="mt-1 block w-full border rounded p-2"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="formal">Formal</option>
          <option value="creative">Creative</option>
        </select>
      </label>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        Generate Letter
      </button>
    </form>
  );
};

export default PromptForm;
