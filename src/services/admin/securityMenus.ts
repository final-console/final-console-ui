// @ts-ignore
/* eslint-disable */
import {request} from 'umi';
import {SecurityMenu} from "@/services/admin/typings";

/**
 * 查询菜单
 * @param params
 * @param options
 */
export async function getSecurityMenus(
  params: {
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {

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

  return request<{
    data: SecurityMenu[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/security-menus', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function sortSecurityMenus(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request('/api/security-menus/sort', {
    method: 'PATCH',
    data,
    ...(options || {}),
  });
}
