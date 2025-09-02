export interface WMOCode {
  day: {
    description: string;
    image: string;
  };
  night: {
    description: string;
    image: string;
  };
}

export interface WMOCodesObject {
  [key: string]: WMOCode;
}
