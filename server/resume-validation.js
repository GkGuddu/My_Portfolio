export const MAX_RESUME_BYTES = 5 * 1024 * 1024

export function validateResume(filename, data) {
  if (typeof filename !== 'string' || !Buffer.isBuffer(data) || !data.length || data.length > MAX_RESUME_BYTES) return null
  const extension = filename.split('.').pop().toLowerCase()
  const types = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }
  const valid = extension === 'pdf' ? data.subarray(0, 5).toString() === '%PDF-'
    : extension === 'doc' ? data.subarray(0, 8).equals(Buffer.from('d0cf11e0a1b11ae1', 'hex'))
      : extension === 'docx' && data.subarray(0, 4).equals(Buffer.from('504b0304', 'hex')) && data.includes(Buffer.from('word/document.xml')) && data.includes(Buffer.from('[Content_Types].xml'))
  if (!valid) return null
  const basename = filename.split(/[\\/]/).pop().replace(/[^a-zA-Z0-9._ -]/g, '_').slice(-120)
  return { filename: basename, mime: types[extension], data }
}
