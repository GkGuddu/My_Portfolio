import { useEffect, useMemo, useState } from 'react'
import { FaCode } from 'react-icons/fa'
import { EDUCATION, PROJECTS, RESUME_LINK, SKILL_CATEGORIES } from './constants'
import { ContentContext } from './content-context-core'

const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const defaultIcons = new Map(SKILL_CATEGORIES.flatMap(category => category.skills.map(skill => [skill.name, skill.icon])))
const defaults = { resumeUrl: RESUME_LINK, skills: SKILL_CATEGORIES, projects: PROJECTS, education: EDUCATION }

const mergeContent = saved => {
  if (!saved || typeof saved !== 'object') return defaults
  const skills = Array.isArray(saved.skills) ? saved.skills.map(category => ({
    ...category,
    skills: Array.isArray(category.skills) ? category.skills.map(skill => ({ ...skill, icon: defaultIcons.get(skill.name) || <FaCode /> })) : [],
  })) : defaults.skills
  return {
    resumeUrl: typeof saved.resumeUrl === 'string' && saved.resumeUrl ? (saved.resumeUrl.startsWith('/api/resume/') ? `${apiBase}${saved.resumeUrl}` : saved.resumeUrl) : defaults.resumeUrl,
    skills,
    projects: Array.isArray(saved.projects) ? saved.projects : defaults.projects,
    education: Array.isArray(saved.education) ? saved.education : defaults.education,
  }
}

export function PortfolioContentProvider({ children }) {
  const [saved, setSaved] = useState(null)
  useEffect(() => {
    fetch(`${apiBase}/api/content`).then(response => response.ok ? response.json() : null).then(data => {
      if (data?.content) setSaved(data.content)
    }).catch(() => {})
  }, [])
  const content = useMemo(() => mergeContent(saved), [saved])
  return <ContentContext.Provider value={{ content }}>{children}</ContentContext.Provider>
}
