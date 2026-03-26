export type GenericObject<T = any> = {
  [key: string]: T;
};

export type Callback = (...args: any) => void;
