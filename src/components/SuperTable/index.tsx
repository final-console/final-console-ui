import type {ActionType, DragTableProps, ParamsType, ProColumns, ProTableProps} from '@ant-design/pro-components';
import {DragSortTable, EditableProTable, ProDescriptions, ProTable, TableDropdown} from '@ant-design/pro-components';
import {Drawer, message} from 'antd';
import {Menu} from "@/services/admin/typings";
import {createFromIconfontCN} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {DomainService} from "@/services/admin/DomainService";
import {UIService} from "@/services/admin/UIService";
import Settings from "../../../config/defaultSettings";
import {DrawerForm} from "@/components/Form/DrawerForm";

const Icon = createFromIconfontCN({scriptUrl: Settings.iconfontUrl});


export enum SupperTableType {
    Table, DragSort, Editable
}

export type SupperTableProps<
    T extends Record<string, any>,
    Q extends ParamsType = ParamsType,
> = {
    resource: string;
    tableType?: SupperTableType;
    onRowActionClick?: (key: string, row: T, action: React.Ref<ActionType>) => void;
    onDragSortEnd?: () => void;
} & ProTableProps<T, Q> & DragTableProps<T, Q>

function SupperTable<
    T extends Record<string, any>,
    Q extends ParamsType = ParamsType,
>(props: SupperTableProps<T, Q>) {

    let {
        resource,
        actionRef,
        onRowActionClick,
        ...otherProps
    } = props;

    const domainService = new DomainService<T, Q>(resource);


    const [viewDrawerVisible, setViewDrawerVisible] = useState<boolean>(false);
    const [editDrawerVisible, setEditDrawerVisible] = useState<boolean>(false);
    const [rowRecord, setRowRecord] = useState<T | undefined>(undefined);

    const iconRender = (_, record) => {
        return (<Icon type={'icon-' + record.icon}/>);
    }

    const actionRender = (_, record, action) => {

        let strings = [{
            key: 'edit',
            name: '编辑',
            type: 'danger'
        }, {
            key: 'view',
            name: '查看',
            type: 'default'
        }, {
            key: 'delete',
            name: '删除',
            type: 'danger'
        }];

        let actions = [];

        let links = strings.length >= 2 ? strings.slice(0, 2) : strings;

        // 生成操作链接
        links.forEach((item) => {
            actions.push(<a
                key={item.key}
                onClick={() => {

                    if (item.key === 'view') {
                        // 查询详情
                        domainService.findById(record.id).then((res) => {
                            setRowRecord(res.data);
                            setViewDrawerVisible(true);
                        });
                    } else if (item.key === 'edit') {
                        // 查询详情
                        domainService.findById(record.id).then((res) => {
                            setRowRecord(res.data);
                            setEditDrawerVisible(true);
                        });
                    }

                    if (onRowActionClick) {
                        onRowActionClick(item.key, record, action);
                    }
                }}
            >
                {item.name}
            </a>)
        });

        if (strings.length > 2) {


            actions.push(<TableDropdown
                key="actionGroup"
                onSelect={() => action?.reload()}
                menus={strings.slice(2)}
            />)
        }


        console.log("action", record)
        return actions;
    }

    const columnRenders = {
        icon: iconRender,
        option: actionRender
    };


    const uiService = new UIService(resource);

    const [columns, setColumns] = useState<ProColumns[]>([]);


    const onDragSortEnd = (newDataSource: Menu[]) => {
        console.log('排序后的数据', newDataSource);
        domainService.sort(newDataSource).then(() => {
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

    const request = async (params: any, sort: any, filter: any) => await domainService.list(params, sort);

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
            <Drawer
                title={'查看'}
                open={viewDrawerVisible}
                width={'40%'}
                onClose={() => setViewDrawerVisible(false)}

            >
                <ProDescriptions<T>
                    columns={columns}
                    dataSource={rowRecord}
                >

                </ProDescriptions>
            </Drawer>

            <DrawerForm<T>
                title={'编辑'}
                open={editDrawerVisible}
                width={'40%'}
                onOpenChange={(open) => {
                    setEditDrawerVisible(open)
                }}
                onFinish={async (values) => {
                    console.log(values);
                    setEditDrawerVisible(false);

                    domainService.updateById(rowRecord?.id, values).then(() => {
                        actionRef?.current?.reload();
                        message.success('修改成功');
                    });


                }}
                columns={columns}
                initialValues={rowRecord}

            >

            </DrawerForm>


        </>
    )
        ;
};

export default SupperTable;
