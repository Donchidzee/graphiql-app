import React, { useState, useEffect } from 'react';
import { TabPanel } from '@chakra-ui/react';
import JsonEditor from '@/components/JsonEditor';

interface VariablesEditorProps {
  variablesJson: object;
  setVariablesJson: (json: object) => void;
}

const VariablesEditor: React.FC<VariablesEditorProps> = ({
  variablesJson,
  setVariablesJson,
}) => {
  const handleVariablesChange = (json: string) => {
    const parsedJson = JSON.parse(json);
    setVariablesJson(parsedJson);
  };

  return (
    <TabPanel>
      <JsonEditor
        code={JSON.stringify(variablesJson, null, 2)}
        onChange={handleVariablesChange}
      />
    </TabPanel>
  );
};

export default VariablesEditor;
