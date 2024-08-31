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
  body: string;
  headers: Header[];
};