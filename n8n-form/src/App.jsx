import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setMessage('Please select a PDF file.')
      return
    }
    if (file.type !== 'application/pdf') {
      setMessage('Only PDF files are allowed.')
      return
    }
    setUploading(true)
    setMessage('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL
      if (!webhookUrl) {
        setMessage('Webhook URL is not configured.')
        setUploading(false)
        return
      }
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        setMessage('File uploaded successfully!')
      } else {
        setMessage('Upload failed.')
      }
    } catch (err) {
      setMessage('An error occurred during upload.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <label>
          Upload PDF:
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ marginLeft: 8 }}
          />
        </label>
        <button type="submit" disabled={uploading} style={{ marginLeft: 8 }}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
