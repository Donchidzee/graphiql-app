import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';

interface JsonEditorProps {
  code: string;
  onChange: (json: string) => void;
}

const customTheme = EditorView.theme(
  {
    '&': {
      color: '#ffffff', // Default text color
      backgroundColor: '#282c34', // Background color for the editor
      fontSize: '14px', // Font size for the editor text
    },
    '.cm-gutters': {
      backgroundColor: '#2c313a', // Background color for line numbers gutter
      borderRight: '1px solid #4b4b4b', // Border color for gutters
    },
    '.cm-lineNumbers': {
      color: '#5c6370', // Color for line numbers
    },
    '.cm-keyword': { color: '#c678dd' }, // Color for keywords
    '.cm-atom': { color: '#d19a66' }, // Color for atoms
    '.cm-number': { color: '#d19a66' }, // Color for numbers
    '.cm-def': { color: '#e06c75' }, // Color for definitions
    '.cm-variable': { color: '#e5c07b' }, // Color for variables
    '.cm-comment': { color: '#5c6370', fontStyle: 'italic' }, // Color for comments and italicize them
    '.cm-string': { color: '#98c379' }, // Color for strings
    '.cm-property': { color: '#61afef' }, // Color for properties
    '.cm-operator': { color: '#56b6c2' }, // Color for operators
  },
  { dark: true } // Dark theme mode
);

const JsonEditor: React.FC<JsonEditorProps> = ({ code, onChange }) => {
  const [localCode, setLocalCode] = useState<string>(code);

  const handleBlur = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(localCode), null, 2);
      setLocalCode(formatted);
      if (formatted !== code) {
        onChange(formatted);
      }
    } catch (e) {
      console.error('Invalid JSON:', e);
    }
  };

  const jsonLinter = (view: EditorView) => {
    const diagnostics = [];
    try {
      JSON.parse(view.state.doc.toString());
    } catch (e) {
      const message = e.message;

      const match = message.match(/position (\d+)/);
      const position = match ? parseInt(match[1], 10) : 0;

      diagnostics.push({
        from: position,
        to: position,
        severity: 'error',
        message: message,
      });
    }
    return diagnostics;
  };

  return (
    <CodeMirror
      theme={customTheme}
      value={localCode}
      minHeight="300px"
      maxHeight="300px"
      extensions={[json(), linter(jsonLinter), lintGutter()]}
      onChange={(value) => {
        setLocalCode(value);
      }}
      onBlur={handleBlur}
      style={{
        border: '1px solid silver',
        fontSize: '14px',
        overflowY: 'scroll',
        background: '#CBD5E0',
        color: 'white',
      }}
    />
  );
};

export default JsonEditor;
