
export enum OperationType {
  ADD = 'add',
  SUBTRACT = 'subtract',
}

export interface Entry {
  id: string;
  value: number;
  type: OperationType;
}

export interface Entries {
  [key: string]: Entry[];
}
