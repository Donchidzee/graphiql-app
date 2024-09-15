export interface ResponseValue {
  data?: string;
  status?: string;
  headers?: Headers;
}

export interface ResponseAreaProps {
  responseValue: ResponseValue;
}

export type Header = {
  headerIndex: number;
  key: string;
  value: string;
};

export type inputsState = {
  url: string;
  urlError: boolean;
  sdlUrl: string;
  sdlUrlError: boolean;
  body: string;
  headers: Header[];
};

export type RequestHistory = {
  endpoint: string;
  variables: string;
};

export interface BodyInputRef {
  bodyTextInputRef: React.RefObject<HTMLTextAreaElement>;
  bodyJsonInputRef: React.RefObject<HTMLTextAreaElement>;
  handleBodyTextInputFocus: (isFocused: boolean) => void;
}
