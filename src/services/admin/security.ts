// @ts-ignore
/* eslint-disable */
import {request} from 'umi';
import {MenuDataItem} from "@ant-design/pro-layout";

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
  return request<{
    data: MenuDataItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/security/menus', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
