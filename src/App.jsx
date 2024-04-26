import './App.css'
import { useRef } from 'react';
import Editor/* , { DiffEditor, useMonaco, loader } */ from '@monaco-editor/react'

function App() {

  const monacoRef = useRef(null)

  function handleEditorChange(value, event) {
    // here is the current value
    console.log("this is the current value:", value);
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
    </>
  )
}

export default App
