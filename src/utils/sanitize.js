const TAG_REGEX = /<[^>]*>/g
const DATA_PROTOCOL_REGEX = /\bdata\s*:[^\s]*/gi
const SCRIPT_PROTOCOL_REGEX = /\b(?:javascript|vbscript)\s*:/gi
const SCRIPT_TOKEN_REGEX = /\/?script/gi
const UNSAFE_CHARS_REGEX = /[<>`]/g
const MULTI_SPACE_REGEX = /\s+/g

function stripControlCharacters(value) {
  return Array.from(value)
    .filter((character) => {
      const code = character.charCodeAt(0)
      return code >= 32 && code !== 127
    })
    .join('')
}

export function sanitizePlainText(input) {
  const source = String(input ?? '')
  return stripControlCharacters(source)
    .replace(TAG_REGEX, ' ')
    .replace(DATA_PROTOCOL_REGEX, ' ')
    .replace(SCRIPT_PROTOCOL_REGEX, '')
    .replace(SCRIPT_TOKEN_REGEX, ' ')
    .replace(UNSAFE_CHARS_REGEX, ' ')
    .replace(MULTI_SPACE_REGEX, ' ')
    .trim()
}
