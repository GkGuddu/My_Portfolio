export const CONTACT_LIMITS = Object.freeze({
  name: { min: 2, max: 80 },
  email: { min: 3, max: 254 },
  subject: { min: 0, max: 120 },
  message: { min: 10, max: 5000 },
})

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { fields: { form: 'Send a JSON object containing your contact details.' } }
  }

  const fields = {}
  const contact = {}

  for (const [field, limits] of Object.entries(CONTACT_LIMITS)) {
    const value = body[field] === undefined && field === 'subject' ? '' : body[field]
    if (typeof value !== 'string') {
      fields[field] = `Please enter your ${field}.`
      continue
    }

    const trimmed = value.trim()
    if (trimmed.length < limits.min || trimmed.length > limits.max) {
      fields[field] = field === 'subject'
        ? `Subject must be ${limits.max} characters or fewer.`
        : `${field[0].toUpperCase()}${field.slice(1)} must be ${limits.min}–${limits.max} characters.`
      continue
    }

    if (field === 'email' && !EMAIL_PATTERN.test(trimmed)) {
      fields.email = 'Please enter a valid email address.'
      continue
    }

    contact[field] = field === 'email' ? trimmed.toLowerCase() : trimmed
  }

  if (body.website !== undefined && (typeof body.website !== 'string' || body.website.trim() !== '')) {
    fields.form = 'Your submission could not be accepted.'
  }

  return Object.keys(fields).length ? { fields } : { contact }
}
