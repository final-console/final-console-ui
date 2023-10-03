export type Result<T> = {
  data: T;
}

export type Entity = {
  id?: number;
}

export type Query = {
  orders: string;
}


export type SecurityMenu = {
  name: string;
  path: string;
  icon?: string;
} & Entity;

export type SecurityMenuQuery = {
  name?: string;
  path?: string;
} & Query;
