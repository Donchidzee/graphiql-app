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
      color: '#ffffff',
      backgroundColor: '#282c34',
      fontSize: '14px',
    },
    '.cm-gutters': {
      backgroundColor: '#2c313a',
      borderRight: '1px solid #4b4b4b',
    },
    '.cm-lineNumbers': {
      color: '#5c6370',
    },
  },
  { dark: true }
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
