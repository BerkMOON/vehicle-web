export interface ResponseInfoType<T> {
  response_status: ResponseStatus;
  data: T;
}

export interface ResponseStatus {
  code: number;
  extension: {
    key: string;
    value: string;
  };
  msg: string;
}
