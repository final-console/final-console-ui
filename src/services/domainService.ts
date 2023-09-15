// @ts-ignore
/* eslint-disable */
import {request} from 'umi';

export async function list(
    params: {
        resource: string;
        // query
        /** 当前的页码 */
        current?: number;
        /** 页面的容量 */
        pageSize?: number;
    },
    options?: { [key: string]: any },
) {

    const resource = params.resource;

    return request<{
        data: any[];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    }>(`/api/${resource}`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

export async function detail(
    resource: string,
    params: {
        // query
        /** 当前的页码 */
        current?: number;
        /** 页面的容量 */
        pageSize?: number;
        [key: string]: any;

    },
    options?: { [key: string]: any },
) {
    return request<{
        data: any;
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    }>(`/api/${resource}/detail`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}


export async function addVideoTraining(resource: string,data: { [key: string]: any }, options?: { [key: string]: any }) {
    return request(`/api/${resource}`, {
        method: 'POST',
        data,
        ...(options || {}),
    });
}

export async function updateProject(resource: string,id: number, data: { [key: string]: any }, options?: { [key: string]: any }) {
    return request(`/api/${resource}/${id}`, {
        method: 'PATCH',
        data,
        ...(options || {}),
    });
}

export async function deleteProject(resource: string, id: number, data: { [key: string]: any }, options?: { [key: string]: any }) {
    return request(`/api/${resource}/${id}`, {
        method: 'DELETE',
        data,
        ...(options || {}),
    });
}

/**
 * 引用项目到套餐或机构
 * @param data
 * @param options
 */
export async function quoteProjects(data: { [key: string]: any }, options?: { [key: string]: any }) {
    return request(`/api/${data.resource}/quote`, {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/x-www-form-urlencoded'
        // },
        // data: qs.stringify(data),
        data,
        ...(options || {}),
    });
}
export async function quickQuoteProjects(data: { [key: string]: any }, options?: { [key: string]: any }) {
    return request('/api/projects/quick-quote', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/x-www-form-urlencoded'
        // },
        // data: qs.stringify(data),
        data,
        ...(options || {}),
    });
}



