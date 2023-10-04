import {request} from 'umi';
import {Entity, Query, Result} from "@/services/admin/typings";

export class DomainService<T extends Entity, Q extends Query> {
    private readonly resource: string;

    constructor(resource: string) {
        this.resource = resource;
    };


    /**
     * 查询菜单
     * @param params
     * @param options
     */
    list(params: Q, options?: { [key: string]: any },) {
        if (options) {
            const column: string = Object.keys(options)[0];
            const order = Object.values(options)[0];
            if (column) {
                console.log("order:" + column + "=" + order);
                if (order === "ascend") {
                    params.orders = column;
                } else {
                    params.orders = column + " desc";
                }
                console.log("params:" + JSON.stringify(params));
            }
        }

        return request<Result<T[]>>(`/api/${this.resource}`, {
            method: 'GET',
            params: {
                ...params,
            },
            ...(options || {}),
        });
    }

    /**
     * 根据ID查询详情
     * @param id id
     */
    findById(id: number | string) {
        return request<Result<T>>(`/api/${this.resource}/${id}`, {
            method: 'GET',
        });
    }

    async sort(data: T[], options?: { [key: string]: any }) {

        for (let i = 0; i < data.length; i++) {
            data[i].sortValue = i + 1;
        }


        return request(`/api/${this.resource}/sort`, {
            method: 'PATCH',
            data: data,
            ...(options || {}),
        });
    }

}
