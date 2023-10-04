import type {ActionType, DragTableProps, ProColumns, ProTableProps} from '@ant-design/pro-components';
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

export type SupperTableProps<T, Q> = {
    resource: string;
    tableType?: SupperTableType;
    formRef: React.MutableRefObject<Q>;
    actionRef: React.MutableRefObject<ActionType>;
    onRowActionClick?: (row: T) => void;
    onDragSortEnd?: () => void;
} & ProTableProps<T, Q> & DragTableProps<T, Q>

const SupperTable: React.FC<SupperTableProps> = (props) => {

    const resourceService = new DomainService(props.resource);
    const uiService = new UIService(props.resource);

    const [columns, setColumns] = useState<ProColumns[]>([]);

    const onDragSortEnd = (newDataSource: Menu[]) => {
        console.log('排序后的数据', newDataSource);
        resourceService.sort(newDataSource).then(() => {
            props?.actionRef?.current?.reload();
            props?.onDragSortEnd();
            message.success('修改列表排序成功');
        });
    };

    useEffect(() => {
        uiService.columns().then((res) => {

            console.log(JSON.stringify(res.data));

            let _columns: ProColumns[] = res.data.map(({valueType, ...item}) => ({
                ...item,
                valueType: valueType,
                render: columnRenders[valueType],
            }));


            setColumns(_columns);
        });
    }, [])

    const request = async (params: any, sort: any, filter: any) => await resourceService.list(params, sort);

    return (
        <>
            {
                props.tableType === SupperTableType.Table
                && <ProTable {...props} columns={columns} request={request}/>
            }
            {
                props.tableType === SupperTableType.DragSort
                && <DragSortTable {...props}
                                  onDragSortEnd={onDragSortEnd}
                                  rowKey={'id'}
                                  columns={columns}
                                  dragSortKey="sort"
                                  params={props.params}
                                  request={async (params, sort) => await resourceService.list(params, sort)}
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
