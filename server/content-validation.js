const text = (value, max = 500) => typeof value === 'string' && value.trim().length <= max ? value.trim() : null

const safeUrl = value => {
  const url = text(value)
  if (!url || /[\s\\]/.test(url)) return null
  if (/^\/(?!\/)/.test(url)) return url
  try {
    const parsed = new URL(url)
    return ['https:', 'http:'].includes(parsed.protocol) && !parsed.username && !parsed.password ? url : null
  } catch {
    return null
  }
}

const list = (value, mapper, max = 50) => {
  if (!Array.isArray(value) || value.length > max) return null
  const result = value.map(mapper)
  return result.every(Boolean) ? result : null
}

const skillCategory = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const name = text(value.name, 80)
  const tone = ['lavender', 'pink', 'cream', 'mustard'].includes(value.tone) ? value.tone : null
  const description = text(value.description, 180)
  const skills = list(value.skills, skill => {
    const name = text(skill?.name, 80)
    return name ? { name } : null
  }, 40)
  return name && tone && description && skills ? { name, tone, description, skills } : null
}

const project = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const title = text(value.title, 100)
  const description = text(value.description, 1000)
  const image = safeUrl(value.image)
  const techStack = list(value.techStack, tech => {
    const name = text(tech, 60)
    return name || null
  }, 30)
  const link = value.link == null || value.link === '' ? null : safeUrl(value.link)
  const github = value.github == null || value.github === '' ? null : safeUrl(value.github)
  return title && description && image && techStack && (value.link == null || value.link === '' || link !== null) && (value.github == null || value.github === '' || github !== null)
    ? { title, description, image, techStack, link, github }
    : null
}

const education = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const id = text(value.id, 80)
  const degree = text(value.degree, 140)
  const label = value.label == null ? '' : text(value.label, 40)
  const field = value.field == null || value.field === '' ? undefined : text(value.field, 160)
  const institution = text(value.institution, 220)
  const startLabel = text(value.start?.label, 60)
  const startValue = text(value.start?.value, 30)
  const endLabel = text(value.end?.label, 60)
  const endValue = text(value.end?.value, 30)
  const cgpa = value.cgpa == null || value.cgpa === '' ? undefined : text(value.cgpa, 20)
  const level = text(value.level, 80)
  const focus = value.focus == null ? undefined : list(value.focus, item => text(item, 80), 20)
  if (!id || !degree || (value.field != null && value.field !== '' && !field) || !institution || !startLabel || !startValue || !endLabel || !endValue || (value.cgpa != null && value.cgpa !== '' && !cgpa) || !level || (value.focus != null && !focus)) return null
  if (label === null || !/^[a-zA-Z0-9_-]+$/.test(id)) return null
  return { id, degree, ...(label ? { label } : {}), ...(field ? { field } : {}), institution, start: { label: startLabel, value: startValue }, end: { label: endLabel, value: endValue }, ...(cgpa ? { cgpa } : {}), level, ...(focus ? { focus } : {}) }
}

export function validatePortfolioContent(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { fields: { form: 'Send a content object.' } }
  const resumeUrl = safeUrl(value.resumeUrl)
  const skills = list(value.skills, skillCategory, 20)
  const projects = list(value.projects, project, 30)
  const educationItems = list(value.education, education, 20)
  const fields = {}
  if (!resumeUrl) fields.resumeUrl = 'CV link must be an HTTP(S) URL or a path starting with /.'
  if (!skills) fields.skills = 'Skills data is invalid.'
  if (!projects) fields.projects = 'Projects data is invalid.'
  if (!educationItems) fields.education = 'Education data is invalid.'
  else if (new Set(educationItems.map(item => item.id)).size !== educationItems.length) fields.education = 'Education IDs must be unique.'
  return Object.keys(fields).length ? { fields } : { content: { resumeUrl, skills, projects, education: educationItems } }
}
