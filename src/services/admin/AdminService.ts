import {request} from "@@/exports";
import {MenuDataItem} from "@ant-design/pro-layout";

export async function adminMenus(
  params?: {
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: MenuDataItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/admin/menus', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
