export class Query {
  constructor(fnName: any, argumentsMap?: any);
  static toString(): string;
  setAlias(alias: string): void;
  filter(...filters: any[]): void;
  find(...inputs: any[]): any;
  toString(): string;
}

export default Query;
