import { memo, useCallback, useMemo, useState } from 'react'
import './App.css'
import { sanitizePlainText } from './utils/sanitize'

const INITIAL_RECORDS = [
  { id: 1, title: 'Homepage Largest Contentful Paint', score: 58, status: 'Needs review' },
  { id: 2, title: 'Article Page JavaScript Payload', score: 71, status: 'Monitoring' },
  { id: 3, title: 'Image Optimization Coverage', score: 82, status: 'Stable' },
]

const SearchAndActions = memo(function SearchAndActions({
  searchTerm,
  onSearchChange,
  onOptimize,
  isLoading,
}) {
  return (
    <section aria-label="Optimization actions" className="panel" role="region">
      <label className="field-group" htmlFor="search-content">
        <span className="field-label">Search content</span>
        <input
          id="search-content"
          name="search"
          type="search"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search by record title"
          autoComplete="off"
        />
      </label>
      <button type="button" onClick={onOptimize} disabled={isLoading}>
        Optimize first matching record
      </button>
    </section>
  )
})

const RecordList = memo(function RecordList({ records }) {
  if (records.length === 0) {
    return <p className="empty-state">No data found</p>
  }

  return (
    <ul className="record-list" aria-label="Performance records">
      {records.map((record) => (
        <li className="record-item" key={record.id}>
          <h3>{record.title}</h3>
          <p>Score: {record.score}</p>
          <p>Status: {record.status}</p>
        </li>
      ))}
    </ul>
  )
})

const AddRecordForm = memo(function AddRecordForm({ formValues, errors, onChange, onSubmit }) {
  return (
    <section className="panel" aria-label="Add new record" role="region">
      <h2>Add performance record</h2>
      <form noValidate onSubmit={onSubmit}>
        <label className="field-group" htmlFor="content-title">
          <span className="field-label">Content title</span>
          <input
            id="content-title"
            name="title"
            type="text"
            value={formValues.title}
            onChange={onChange}
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
        </label>
        {errors.title ? (
          <p id="title-error" className="error-text" role="alert">
            {errors.title}
          </p>
        ) : null}

        <label className="field-group" htmlFor="performance-score">
          <span className="field-label">Performance score</span>
          <input
            id="performance-score"
            name="score"
            type="number"
            inputMode="numeric"
            value={formValues.score}
            onChange={onChange}
            aria-invalid={errors.score ? 'true' : 'false'}
            aria-describedby={errors.score ? 'score-error' : undefined}
          />
        </label>
        {errors.score ? (
          <p id="score-error" className="error-text" role="alert">
            {errors.score}
          </p>
        ) : null}

        <button type="submit">Add record</button>
      </form>
    </section>
  )
})

function validateRecord(values) {
  const nextErrors = {}

  if (!values.title.trim()) {
    nextErrors.title = 'Title is required'
  }

  const numericScore = Number(values.score)
  if (!values.score.trim() || Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
    nextErrors.score = 'Score must be a number between 0 and 100'
  }

  return nextErrors
}

function App() {
  const [records, setRecords] = useState(INITIAL_RECORDS)
  const [searchTerm, setSearchTerm] = useState('')
  const [formValues, setFormValues] = useState({ title: '', score: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const filteredRecords = useMemo(() => {
    const loweredTerm = searchTerm.toLowerCase()
    return records.filter((record) => record.title.toLowerCase().includes(loweredTerm))
  }, [records, searchTerm])

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(sanitizePlainText(event.target.value))
  }, [])

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    const sanitizedValue = sanitizePlainText(value)

    setFormValues((current) => ({
      ...current,
      [name]: sanitizedValue,
    }))

    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors
      }

      const updatedErrors = { ...currentErrors }
      delete updatedErrors[name]
      return updatedErrors
    })
  }, [])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      const nextErrors = validateRecord(formValues)

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors)
        setStatusMessage('Please resolve form errors before submitting.')
        return
      }

      const newRecord = {
        id: Date.now(),
        title: sanitizePlainText(formValues.title),
        score: Number(formValues.score),
        status: 'New',
      }

      setRecords((currentRecords) => [newRecord, ...currentRecords])
      setFormValues({ title: '', score: '' })
      setErrors({})
      setStatusMessage('Record added successfully.')
    },
    [formValues],
  )

  const handleOptimize = useCallback(async () => {
    if (filteredRecords.length === 0) {
      setStatusMessage('No data found to optimize.')
      return
    }

    const targetRecord = filteredRecords[0]
    setIsLoading(true)
    setStatusMessage('')

    await new Promise((resolve) => {
      setTimeout(resolve, 1500)
    })

    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === targetRecord.id
          ? {
              ...record,
              score: Math.min(record.score + 5, 100),
              status: 'Optimized',
            }
          : record,
      ),
    )

    setIsLoading(false)
    setStatusMessage(`Optimization completed for ${targetRecord.title}.`)
    console.log('[Analytics] User interacted with Performance Optimization')
  }, [filteredRecords])

  return (
    <div className="app-shell">
      <header className="banner" role="banner">
        <h1>News Blog Performance Optimization</h1>
        <p>Inspect records and run focused optimization workflows.</p>
      </header>

      <main className="layout" role="main">
        <SearchAndActions
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onOptimize={handleOptimize}
          isLoading={isLoading}
        />

        {isLoading ? (
          <p className="status" role="status" aria-live="polite">
            Optimizing record over slow network...
          </p>
        ) : null}

        <section className="panel" aria-label="Current records" role="region">
          <h2>Current records</h2>
          <RecordList records={filteredRecords} />
        </section>

        <AddRecordForm
          formValues={formValues}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />

        <p className="status" role="status" aria-live="polite">
          {statusMessage}
        </p>
      </main>
    </div>
  )
}

export default App
