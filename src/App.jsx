import './App.css'
import { useRef, useState } from 'react';
import Editor/* , { DiffEditor, useMonaco, loader } */ from '@monaco-editor/react'

function App() {

  const monacoRef = useRef(null)
  const [files, setFiles] = useState([{ name: 'app.py', code: '' }])
  const [currentFile, setCurrentFile] = useState(0)
  const [nameNewFile, setNameNewFile] = useState('')

  function handleEditorChange(value, event) {
    // here is the current value
    console.log("this is the current value:", value);
    console.log(monacoRef.current);
    const fileWithChanges = files.map((file, index) => index === currentFile ? { ...file, code: value } : file)
    setFiles(fileWithChanges)
  }

  function handleEditorDidMount(editor, monaco) {
    
  }

  function handleEditorWillMount(monaco) {
    console.log('beforeMount: the monaco instance:', monaco);
  }

  function handleEditorValidation(markers) {
    // model markers
    // markers.forEach(marker => console.log('onValidate:', marker.message));
  }

  const handleCreateNewFile = () => {
    const exists = files.some(file => file.name === nameNewFile)
    if (exists) alert("No pueden haber 2 archivos con el mismo nombre!")
    else if (nameNewFile.length > 0) {
      setFiles([...files, { name: nameNewFile, code: '' }])
      setNameNewFile('')
    }
  }

  const handleDeleteFile = (name) => {
    if (files[currentFile].name === name) alert("No puedes eliminar el archivo en el que estás parado!")
    else {
      const newFiles = files.filter(file => file.name !== name)
      setCurrentFile(0)
      setFiles(newFiles)
    }
  }

  function handleExecuteCode() {
    fetch('http://localhost:3000/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: files[currentFile].code
      })
    })
  }

  function handleDownload(nameFile, contentFile) {
    const element = document.createElement("a")
    const file = new Blob([contentFile], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = nameFile
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className='main-bg vw-100 vh-100 d-flex'>
      <div>
        <ul className='list-group list-group-flush text-white p-2'>
          {
            files.map((file, index) => {
              return (
                <li key={index} className='d-flex justify-content-between'>
                  <p onClick={() => setCurrentFile(index)}>{file.name}</p>
                  <p onClick={() => handleDeleteFile(file.name)}>x</p>
                </li>
              )
            })
          }
        </ul>
        <input type="text" className='w-100' placeholder='Name...' value={nameNewFile} onChange={(e) => setNameNewFile(e.target.value)}/>
        <button onClick={handleCreateNewFile}>New File</button>
      </div>
      <div>
        <Editor 
          height="90vh" 
          width="90vw" 
          defaultLanguage='python' 
          theme='vs-dark'
          onMount={handleEditorDidMount}
          beforeMount={handleEditorWillMount}
          onValidate={handleEditorValidation}
          onChange={handleEditorChange} 
          value={files[currentFile].code}
        />
        <button onClick={() => handleDownload(files[currentFile].name, files[currentFile].code)}>Export Code</button>
        <button onClick={handleExecuteCode}>Execute</button>
      </div>
    </div>
  )
}

export default App
