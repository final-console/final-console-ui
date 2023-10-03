import {request} from "@@/exports";
import {ProColumns} from "@ant-design/pro-components";

export async function uiColumns(
    resource: string,
  params?: {
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: ProColumns[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>(`/api/ui/${resource}/columns`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
