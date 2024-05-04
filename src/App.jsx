import './App.css'
import { useRef, useState } from 'react';
import Editor/* , { DiffEditor, useMonaco, loader } */ from '@monaco-editor/react'

function App() {

  const monacoRef = useRef(null)
  const [outPut, setOutPut] = useState('')
  const [outPut2, setOutPut2] = useState('')
  const [files, setFiles] = useState([{ name: 'app.py', code: '' }, { name: 'manage.py', code: '' }, { name: 'settings.py', code: '' }, { name: 'urls.py', code: '' }, { name: 'modules.py', code: '' }])
  const [firstOutPut, setFirstOutPut] = useState(true)
  const [currentFile, setCurrentFile] = useState(0)

  function handleEditorChange(value, event) {
    // here is the current value
    console.log("this is the current value:", value);
    console.log(monacoRef.current);
    // firstOutPut ?
    //   setOutPut(value) :
    //   setOutPut2(value)
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
      <ul className='list-group list-group-flush text-white'>
        <li onClick={() => setCurrentFile(0)}>app.py</li>
        <li onClick={() => setCurrentFile(1)}>manage.py</li>
        <li onClick={() => setCurrentFile(2)}>settings.py</li>
        <li onClick={() => setCurrentFile(3)}>urls.py</li>
        <li onClick={() => setCurrentFile(4)}>modules.py</li>
      </ul>
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
        {/* <button onClick={() => setFirstOutPut(!firstOutPut)}>Change Code</button> */}
        <button onClick={() => handleDownload(files[currentFile].name, files[currentFile].code)}>Export Code</button>
        <button onClick={handleExecuteCode}>Execute</button>
      </div>
    </div>
  )
}

export default App
