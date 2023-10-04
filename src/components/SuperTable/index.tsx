import type {DragTableProps, ParamsType, ProColumns, ProTableProps} from '@ant-design/pro-components';
import {DragSortTable, EditableProTable, ProTable} from '@ant-design/pro-components';
import {message} from 'antd';
import {Menu} from "@/services/admin/typings";
import {createFromIconfontCN} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {DomainService} from "@/services/admin/DomainService";
import {UIService} from "@/services/admin/UIService";
import Settings from "../../../config/defaultSettings";

const Icon = createFromIconfontCN({scriptUrl: Settings.iconfontUrl});

const iconRender = (_, record) => {
    return (<Icon type={'icon-' + record.icon}/>);
}

const columnRenders = {
    icon: iconRender,
};

export enum SupperTableType {
    Table, DragSort, Editable
}

export type SupperTableProps<
    T extends Record<string, any>,
    Q extends ParamsType = ParamsType,
> = {
    resource: string;
    tableType?: SupperTableType;
    onRowActionClick?: (row: T) => void;
    onDragSortEnd?: () => void;
} & ProTableProps<T, Q> & DragTableProps<T, Q>

function SupperTable<
    T extends Record<string, any>,
    Q extends ParamsType = ParamsType,
>(props: SupperTableProps<T, Q>) {

    let {
        resource,
        actionRef,
        ...otherProps
    } = props;


    const resourceService = new DomainService(resource);
    const uiService = new UIService(resource);

    const [columns, setColumns] = useState<ProColumns[]>([]);

    const onDragSortEnd = (newDataSource: Menu[]) => {
        console.log('排序后的数据', newDataSource);
        resourceService.sort(newDataSource).then(() => {
            console.log("actionRef", actionRef);
            actionRef?.current?.reload();
            props?.onDragSortEnd();
            message.success('修改列表排序成功');
        });
    };


    useEffect(() => {

        console.log("resource发生变化了。。。", resource)

        uiService.columns().then((res) => {
            console.log(JSON.stringify(res.data));

            let _columns: ProColumns[] = res.data.map(({valueType, defaultSortOrder, ...item}) => ({
                ...item,
                valueType: valueType,
                defaultSortOrder: defaultSortOrder?.toLowerCase(),
                render: columnRenders[valueType],
            }));

            setColumns(_columns);

            // 首次请求
            actionRef?.current?.reload();

        });
    }, [resource])

    const request = async (params: any, sort: any, filter: any) => await resourceService.list(params, sort);

    return (
        <>
            {
                props.tableType === SupperTableType.Table
                && <ProTable {...props}
                             manualRequest={true}
                             columns={columns} request={request}/>
            }
            {
                props.tableType === SupperTableType.DragSort
                && <DragSortTable {...props}
                                  onDragSortEnd={onDragSortEnd}
                                  rowKey={'id'}
                                  columns={columns}
                                  dragSortKey="sort"
                                  params={props.params}
                                  request={request}
                />}
            {
                props.tableType === SupperTableType.Editable
                && <EditableProTable {...props} columns={columns}
                                     request={request}/>
            }
        </>
    );
};

export default SupperTable;
