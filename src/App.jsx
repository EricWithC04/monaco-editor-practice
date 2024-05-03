import './App.css'
import { useRef, useState } from 'react';
import Editor/* , { DiffEditor, useMonaco, loader } */ from '@monaco-editor/react'

function App() {

  const monacoRef = useRef(null)
  const [outPut, setOutPut] = useState('')

  function handleEditorChange(value, event) {
    // here is the current value
    console.log("this is the current value:", value);
    setOutPut(value)
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
        code: outPut
      })
    })
  }

  function handleDownload(nameFile, contentFile) {
    const element = document.createElement("a")
    const file = new Blob([contentFile], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `${nameFile}.py`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <>
      <Editor 
        height="90vh" 
        width="90vw" 
        defaultLanguage='python' 
        theme='vs-dark'
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
        onValidate={handleEditorValidation}
        onChange={handleEditorChange} 
      />
      <button onClick={() => handleDownload('app', outPut)}>Export Code</button>
      <button onClick={handleExecuteCode}>Execute</button>
    </>
  )
}

export default App
