export type Result<T> = {
    data: T;
}

export type Entity = {
    id?: number;
}

export type Query = {
    current?: number;
    pageSize?: number;
    orders?: string;
}


export type Menu = {
    name: string;
    path: string;
    icon?: string;
} & Entity;

export type MenuQuery = {
    name?: string;
    path?: string;
    parentId?: number;
} & Query;

export type ResourceColumn = {
    title: string;
    dataIndex: string[];
} & Entity;

export type ResourceColumnQuery = {
    resource: string;
} & Query;
