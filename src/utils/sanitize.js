const TAG_REGEX = /<[^>]*>/g
const DATA_PROTOCOL_REGEX = /\bdata\s*:[^\s]*/gi
const SCRIPT_PROTOCOL_REGEX = /\b(?:javascript|vbscript)\s*:/gi
const SCRIPT_TOKEN_REGEX = /\/?script/gi
const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/g
const UNSAFE_CHARS_REGEX = /[<>`]/g
const MULTI_SPACE_REGEX = /\s+/g

export function sanitizePlainText(input) {
  const source = String(input ?? '')
  return source
    .replace(TAG_REGEX, ' ')
    .replace(DATA_PROTOCOL_REGEX, ' ')
    .replace(SCRIPT_PROTOCOL_REGEX, '')
    .replace(SCRIPT_TOKEN_REGEX, ' ')
    .replace(CONTROL_CHARS_REGEX, ' ')
    .replace(UNSAFE_CHARS_REGEX, ' ')
    .replace(MULTI_SPACE_REGEX, ' ')
    .trim()
}
