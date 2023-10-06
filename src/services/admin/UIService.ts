import {request} from "@@/exports";
import {Query, Result} from "@/services/admin/typings";
import {MenuDataItem} from "@ant-design/pro-layout";
import {Columns} from "@/services/admin/antd.typings";


export class UIService {
    private readonly resource: string;

    constructor(resource: string) {
        this.resource = resource;
    };

    loopMenuItem(menus: any[]) {
        return menus.map(({icon, routes, ...item}) => ({
            ...item,
            icon: icon && ('icon-' + icon),
            children: routes && this.loopMenuItem(routes),
        }));
    }

    menus(params: Query, options?: { [key: string]: any }) {
        console.log("options:" + JSON.stringify(options));
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

        return request<Result<MenuDataItem[]>>(`/api/${this.resource}/menus`, {
            method: 'GET',
            params: {
                ...params,
            },
            ...(options || {}),
        });
    }

    columns(params?: Query, options?: { [key: string]: any },) {
        return request<{
            data: Columns[];
            /** 列表的内容总数 */
            total?: number;
            success?: boolean;
        }>(`/api/ui/${this.resource}/columns`, {
            method: 'GET',
            params: {
                ...params,
                sorter: options
            },
            ...(options || {}),
        });
    }


}

