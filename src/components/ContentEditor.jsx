import { useState } from 'react'

const splitList = value => value.split(',').map(item => item.trim()).filter(Boolean)
const tones = ['lavender', 'pink', 'cream', 'mustard']

function ListInput({ label, values, onChange, disabled }) {
  const [draft, setDraft] = useState(values.join(', '))
  return <label>{label}<span className="admin-field-hint">Separate entries with commas</span><textarea rows="2" value={draft} disabled={disabled} onChange={event => { setDraft(event.target.value); onChange(splitList(event.target.value)) }} /></label>
}

function Field({ label, value, onChange, required = false, ...props }) {
  return <label>{label}<input {...props} value={value || ''} required={required} onChange={event => onChange(event.target.value)} /></label>
}

export default function ContentEditor({ content, setContent, section, setSection, onSave, saving, uploadResume }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadError, setUploadError] = useState(false)
  const [revision, setRevision] = useState(0)
  const busy = saving || uploading
  const update = (collection, index, field, value) => setContent(previous => ({
    ...previous, [collection]: previous[collection].map((item, i) => i === index ? { ...item, [field]: value } : item),
  }))
  const remove = (collection, index) => {
    setContent(previous => ({ ...previous, [collection]: previous[collection].filter((_, i) => i !== index) }))
    setRevision(value => value + 1)
  }
  const add = collection => {
    const entries = {
      skills: { name: '', description: '', tone: tones[content.skills.length % tones.length], skills: [] },
      projects: { title: '', description: '', image: '', techStack: [], link: null, github: null },
      education: { id: crypto.randomUUID(), label: '', degree: '', field: '', institution: '', start: { label: '', value: '' }, end: { label: '', value: '' }, cgpa: '', level: 'Undergraduate' },
    }
    setContent(previous => ({ ...previous, [collection]: [...previous[collection], entries[collection]] }))
  }
  const upload = async () => {
    if (!file) return
    setUploading(true)
    setUploadError(false)
    setUploadStatus('')
    try {
      if (!/\.(pdf|doc|docx)$/i.test(file.name) || file.size === 0 || file.size > 5 * 1024 * 1024) throw new Error('Choose a PDF, DOC or DOCX file up to 5 MB.')
      const result = await uploadResume(file)
      setContent(previous => ({ ...previous, resumeUrl: result.resumeUrl }))
      setUploadStatus(result.filename + ' uploaded. Select Save changes to publish this CV.')
      setFile(null)
    } catch (error) {
      setUploadError(true)
      setUploadStatus(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="admin-editor" aria-label="Edit portfolio content">
      <nav className="admin-editor-tabs" aria-label="Content editor sections">
        {['cv', 'skills', 'projects', 'education'].map(item => <button key={item} type="button" disabled={busy} aria-pressed={section === item} className={section === item ? 'is-active' : ''} onClick={() => setSection(item)}>{item === 'cv' ? 'CV' : item[0].toUpperCase() + item.slice(1)}</button>)}
      </nav>
      <form onSubmit={onSave}>
        <fieldset className="admin-editor-fields" disabled={busy}>
          {section === 'cv' && <div className="admin-form-section">
            <p className="admin-form-intro">Upload your CV, then save changes to update the download on your portfolio.</p>
            <label>CV file (PDF, DOC or DOCX · max 5 MB)<input type="file" accept=".pdf,.doc,.docx" onChange={event => { setFile(event.target.files?.[0] || null); setUploadStatus('') }} /></label>
            <button className="admin-quiet-button" type="button" disabled={!file || busy} onClick={upload}>{uploading ? 'Uploading…' : 'Upload CV'}</button>
            {uploadStatus && <p className={uploadError ? 'admin-status-error' : 'admin-status-success'} role={uploadError ? 'alert' : 'status'}>{uploadStatus}</p>}
            <Field label="CV link" value={content.resumeUrl} required maxLength={500} onChange={value => setContent(previous => ({ ...previous, resumeUrl: value }))} />
          </div>}
          {section === 'skills' && <div className="admin-form-section">
            {content.skills.map((category, index) => <fieldset className="admin-edit-card" key={revision + '-' + index}>
              <legend>Skill card {index + 1}</legend>
              <Field label="Category name" value={category.name} required maxLength={80} onChange={value => update('skills', index, 'name', value)} />
              <Field label="Description" value={category.description} required maxLength={180} onChange={value => update('skills', index, 'description', value)} />
              <label>Card color<select value={category.tone} onChange={event => update('skills', index, 'tone', event.target.value)}>{tones.map(tone => <option key={tone}>{tone}</option>)}</select></label>
              <ListInput label="Skills" values={category.skills.map(skill => skill.name)} onChange={names => update('skills', index, 'skills', names.map(name => ({ name })))} />
              <button type="button" className="admin-delete-button" onClick={() => remove('skills', index)}>Remove card</button>
            </fieldset>)}
            <button type="button" className="admin-add-button" disabled={content.skills.length >= 20} onClick={() => add('skills')}>+ Add skill card</button>
          </div>}
          {section === 'projects' && <div className="admin-form-section">
            {content.projects.map((project, index) => <fieldset className="admin-edit-card" key={revision + '-' + index}>
              <legend>Project {index + 1}</legend>
              <Field label="Title" value={project.title} required maxLength={100} onChange={value => update('projects', index, 'title', value)} />
              <label>Description<textarea rows="3" value={project.description} required maxLength={1000} onChange={event => update('projects', index, 'description', event.target.value)} /></label>
              <Field label="Image URL or path" value={project.image} required maxLength={500} onChange={value => update('projects', index, 'image', value)} />
              <ListInput label="Technologies" values={project.techStack} onChange={value => update('projects', index, 'techStack', value)} />
              <div className="admin-two-column">
                <Field label="Live URL" type="url" value={project.link} maxLength={500} onChange={value => update('projects', index, 'link', value || null)} />
                <Field label="GitHub URL" type="url" value={project.github} maxLength={500} onChange={value => update('projects', index, 'github', value || null)} />
              </div>
              <button type="button" className="admin-delete-button" onClick={() => remove('projects', index)}>Remove project</button>
            </fieldset>)}
            <button type="button" className="admin-add-button" disabled={content.projects.length >= 30} onClick={() => add('projects')}>+ Add project</button>
          </div>}
          {section === 'education' && <div className="admin-form-section">
            {content.education.map((item, index) => <fieldset className="admin-edit-card" key={item.id}>
              <legend>Education {index + 1}</legend>
              <Field label="Short label (e.g. B.Tech or M.Tech)" value={item.label} maxLength={40} onChange={value => update('education', index, 'label', value)} />
              <Field label="Degree" value={item.degree} required maxLength={140} onChange={value => update('education', index, 'degree', value)} />
              <Field label="Field" value={item.field} maxLength={160} onChange={value => update('education', index, 'field', value)} />
              <Field label="Institution" value={item.institution} required maxLength={220} onChange={value => update('education', index, 'institution', value)} />
              <div className="admin-two-column">{['start', 'end'].map(date => <div className="admin-form-section" key={date}>
                <Field label={date === 'start' ? 'Start label (e.g. Aug 2022)' : 'End label (e.g. Jun 2026)'} value={item[date].label} required maxLength={60} onChange={value => update('education', index, date, { ...item[date], label: value })} />
                <Field label={date === 'start' ? 'Start date (YYYY or YYYY-MM)' : 'End date (YYYY or YYYY-MM)'} value={item[date].value} pattern="[0-9]{4}(-[0-9]{2})?" required onChange={value => update('education', index, date, { ...item[date], value })} />
              </div>)}</div>
              <div className="admin-two-column">
                <Field label="CGPA" value={item.cgpa} maxLength={20} onChange={value => update('education', index, 'cgpa', value)} />
                <Field label="Level" value={item.level} required maxLength={80} onChange={value => update('education', index, 'level', value)} />
              </div>
              <ListInput label="Focus" values={item.focus || []} onChange={value => update('education', index, 'focus', value)} />
              <button type="button" className="admin-delete-button" onClick={() => remove('education', index)}>Remove education</button>
            </fieldset>)}
            <button type="button" className="admin-add-button" disabled={content.education.length >= 20} onClick={() => add('education')}>+ Add education</button>
          </div>}
          <button type="submit" className="admin-save-button" disabled={busy}>{saving ? 'Saving…' : 'Save changes ↗'}</button>
        </fieldset>
      </form>
    </section>
  )
}
