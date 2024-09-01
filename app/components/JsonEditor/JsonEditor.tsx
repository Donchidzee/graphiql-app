import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { tokyoNight } from '@uiw/codemirror-themes-all';

interface JsonEditorProps {
  code: string;
  onChange: (json: string) => void;
}

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
      theme={tokyoNight}
      value={localCode}
      minHeight="300px"
      extensions={[json(), linter(jsonLinter), lintGutter()]}
      onChange={(value) => {
        setLocalCode(value);
      }}
      onBlur={handleBlur}
      style={{ border: '1px solid silver' }}
    />
  );
};

export default JsonEditor;
