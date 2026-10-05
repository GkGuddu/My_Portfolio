import { useCallback, useEffect, useMemo, useState } from 'react'
import { EDUCATION, PROJECTS, RESUME_LINK, SKILL_CATEGORIES } from '../constants'
import '../admin.css'
import ContentEditor from './ContentEditor'

const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const sessionKey = 'portfolio_admin_session'

const editableDefaults = {
  resumeUrl: RESUME_LINK,
  skills: SKILL_CATEGORIES.map(category => ({ ...category, skills: category.skills.map(skill => ({ name: skill.name })) })),
  projects: PROJECTS.map(({ title, description, image, techStack, link, github }) => ({ title, description, image, techStack: [...techStack], link, github })),
  education: EDUCATION.map(item => ({ ...item, start: { ...item.start }, end: { ...item.end }, focus: item.focus ? [...item.focus] : undefined })),
}

const editableContent = data => {
  if (!data) return editableDefaults
  return {
    resumeUrl: data.resumeUrl || editableDefaults.resumeUrl,
    skills: Array.isArray(data.skills) ? data.skills.map(category => ({ ...category, skills: (category.skills || []).map(skill => ({ name: typeof skill === 'string' ? skill : skill.name })) })) : editableDefaults.skills,
    projects: Array.isArray(data.projects) ? data.projects : editableDefaults.projects,
    education: Array.isArray(data.education) ? data.education : editableDefaults.education,
  }
}

const getStoredSession = () => {
  try {
    return sessionStorage.getItem(sessionKey) || ''
  } catch {
    return ''
  }
}

const saveSession = token => {
  try {
    sessionStorage.setItem(sessionKey, token)
  } catch {
    return undefined
  }
  return undefined
}

const clearSession = () => {
  try {
    sessionStorage.removeItem(sessionKey)
  } catch {
    return undefined
  }
  return undefined
}

const formatDate = value => {
  if (!value) return 'Unknown date'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}


export default function AdminDashboard() {
  const [sessionToken, setSessionToken] = useState(getStoredSession)
  const [draftEmail, setDraftEmail] = useState('')
  const [draftPassword, setDraftPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState(editableDefaults)
  const [contentVersion, setContentVersion] = useState(0)
  const [panel, setPanel] = useState('messages')
  const [editorSection, setEditorSection] = useState('cv')
  const [status, setStatus] = useState({ kind: 'idle', message: '' })
  const [busyId, setBusyId] = useState('')

  const request = useCallback(async (path, options = {}, authToken = sessionToken) => {
    const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}), ...options.headers }
    const response = await fetch(`${apiBase}${path}`, { ...options, headers })
    const data = response.status === 204 ? null : await response.json().catch(() => null)
    if (!response.ok) throw new Error(data?.fields ? Object.values(data.fields).join(' ') : data?.error || 'The request could not be completed.')
    return data
  }, [sessionToken])

  const loadMessages = useCallback(async () => {
    setStatus({ kind: 'loading', message: '' })
    try {
      const data = await request('/api/admin/messages')
      setMessages(Array.isArray(data?.messages) ? data.messages : [])
      setStatus({ kind: 'idle', message: '' })
    } catch (error) {
      if (/invalid admin (token|session)/i.test(error.message)) {
        clearSession()
        setAuthenticated(false)
        setSessionToken('')
      }
      setStatus({ kind: 'error', message: error.message })
    }
  }, [request])

  const loadContent = useCallback(async () => {
    try {
      const data = await request('/api/content')
      setContent(editableContent(data?.content))
      setContentVersion(value => value + 1)
    } catch (error) {
      setStatus({ kind: 'error', message: error.message })
    }
  }, [request])

  const saveContent = async event => {
    event.preventDefault()
    setStatus({ kind: 'loading', message: '' })
    try {
      await request('/api/admin/content', { method: 'PUT', body: JSON.stringify(content) })
      setStatus({ kind: 'success', message: 'Portfolio content updated.' })
    } catch (error) {
      setStatus({ kind: 'error', message: error.message })
    }
  }

  useEffect(() => {
    if (!sessionToken) return
    Promise.all([request('/api/admin/messages'), request('/api/content')]).then(([data, contentData]) => {
      setMessages(Array.isArray(data?.messages) ? data.messages : [])
      setContent(editableContent(contentData?.content))
      setAuthenticated(true)
    }).catch(() => {
      clearSession()
      setSessionToken('')
    })
  }, [request, sessionToken])

  const login = async event => {
    event.preventDefault()
    const email = draftEmail.trim()
    if (!email || !draftPassword) return setStatus({ kind: 'error', message: 'Enter your admin ID and password.' })
    setStatus({ kind: 'loading', message: '' })
    try {
      const session = await request('/api/admin/session', { method: 'POST', body: JSON.stringify({ email, password: draftPassword }) }, '')
      const nextToken = session?.token
      if (!nextToken) throw new Error('Admin session could not be created.')
      saveSession(nextToken)
      setSessionToken(nextToken)
      setDraftEmail('')
      setDraftPassword('')
      setAuthenticated(true)
      const [data, contentData] = await Promise.all([request('/api/admin/messages', {}, nextToken), request('/api/content', {}, nextToken)])
      setMessages(Array.isArray(data?.messages) ? data.messages : [])
      setContent(editableContent(contentData?.content))
      setStatus({ kind: 'idle', message: '' })
    } catch (error) {
      setStatus({ kind: 'error', message: error.message })
    }
  }

  const logout = () => {
    clearSession()
    setSessionToken('')
    setAuthenticated(false)
    setMessages([])
    setStatus({ kind: 'idle', message: '' })
  }

  const removeMessage = async id => {
    setBusyId(id)
    try {
      await request(`/api/admin/messages/${id}`, { method: 'DELETE' })
      setMessages(previous => previous.filter(message => message._id !== id))
    } catch (error) {
      setStatus({ kind: 'error', message: error.message })
    } finally {
      setBusyId('')
    }
  }

  const unreadLabel = useMemo(() => `${messages.length} ${messages.length === 1 ? 'message' : 'messages'}`, [messages.length])

  if (!authenticated) {
    return (
      <main className="admin-page">
        <section className="admin-login" aria-labelledby="admin-login-title">
          <p className="admin-kicker">PRIVATE WORKSPACE</p>
          <h1 id="admin-login-title">Admin dashboard<span>.</span></h1>
          <p className="admin-muted">Sign in to review messages sent through your portfolio.</p>
          <form className="admin-login-form" onSubmit={login}>
            <label htmlFor="admin-email">Admin ID / email</label>
            <input id="admin-email" type="email" autoComplete="username" value={draftEmail} onChange={event => setDraftEmail(event.target.value)} placeholder="Enter your admin ID" required />
            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" value={draftPassword} onChange={event => setDraftPassword(event.target.value)} placeholder="Enter your password" required />
            <button type="submit" disabled={status.kind === 'loading'}>{status.kind === 'loading' ? 'Checking…' : 'Open dashboard ↗'}</button>
          </form>
          {status.message && <p className="admin-status admin-status-error" role="alert">{status.message}</p>}
          <a className="admin-back-link" href="/">← Back to portfolio</a>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <div className="admin-dashboard">
        <header className="admin-header">
          <div><p className="admin-kicker">PRIVATE WORKSPACE</p><h1>{panel === 'messages' ? 'Messages' : 'Edit portfolio'}<span>.</span></h1></div>
          <div className="admin-header-actions">{panel === 'messages' && <button type="button" className="admin-quiet-button" onClick={loadMessages} disabled={status.kind === 'loading'}>Refresh ↻</button>}{panel === 'content' && <button type="button" className="admin-quiet-button" onClick={loadContent}>Reload</button>}<button type="button" className="admin-quiet-button" onClick={logout}>Log out</button></div>
        </header>
        <nav className="admin-primary-tabs" aria-label="Admin sections"><button type="button" className={panel === 'messages' ? 'is-active' : ''} onClick={() => setPanel('messages')}>Messages <span>{messages.length}</span></button><button type="button" className={panel === 'content' ? 'is-active' : ''} onClick={() => setPanel('content')}>Edit content</button></nav>
        {status.message && <p className={`admin-status admin-status-${status.kind}`} role={status.kind === 'error' ? 'alert' : 'status'}>{status.message}</p>}
        {panel === 'messages' && (
          <>
            <div className="admin-summary"><span>{unreadLabel}</span><span>Stored securely in MongoDB</span></div>
            {messages.length === 0 ? <div className="admin-empty"><h2>No messages yet.</h2><p>New contact form submissions will appear here.</p></div> : (
              <div className="admin-message-list">
                {messages.map(message => (
                  <article className="admin-message-card" key={message._id}>
                    <div className="admin-message-meta"><div><h2>{message.name}</h2><a href={`mailto:${message.email}`}>{message.email}</a></div><time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time></div>
                    {message.subject && <p className="admin-message-subject">{message.subject}</p>}
                    <p className="admin-message-body">{message.message}</p>
                    <button type="button" className="admin-delete-button" onClick={() => removeMessage(message._id)} disabled={busyId === message._id}>{busyId === message._id ? 'Deleting…' : 'Delete message'}</button>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
        {panel === 'content' && <ContentEditor key={contentVersion} content={content} setContent={setContent} section={editorSection} setSection={setEditorSection} onSave={saveContent} saving={status.kind === 'loading'} uploadResume={file => request(`/api/admin/resume?filename=${encodeURIComponent(file.name)}`, { method: 'POST', body: file, headers: { 'Content-Type': 'application/octet-stream' } })} />}
        <a className="admin-back-link" href="/">← Back to portfolio</a>
      </div>
    </main>
  )
}
