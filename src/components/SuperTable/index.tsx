import type {ActionType, DragTableProps, ParamsType, ProColumns, ProTableProps} from '@ant-design/pro-components';
import {DragSortTable, EditableProTable, ProDescriptions, ProTable, TableDropdown} from '@ant-design/pro-components';
import {Button, Drawer, message, Modal, Tooltip} from 'antd';
import {Menu} from "@/services/admin/typings";
import {createFromIconfontCN, ExclamationCircleFilled} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {DomainService} from "@/services/admin/DomainService";
import {UIService} from "@/services/admin/UIService";
import Settings from "../../../config/defaultSettings";
import {DrawerForm} from "@/components/Form/DrawerForm";
import {history} from "@umijs/max";

const Icon = createFromIconfontCN({scriptUrl: Settings.iconfontUrl});


export enum SupperTableType {
    Table, DragSort, Editable
}

export type Action = {
    key: string;
    name: string;
    type: string;
    tips?: string;
}

export interface ColumnRender<T> {
    render: (dom: React.ReactNode, entity: T, index: number, action: React.Ref<ActionType>, schema: ProColumns<T>) => React.ReactNode;
}

export type SupperTableProps<
    T extends Record<string, any>,
    Q extends ParamsType = ParamsType,
> = {
    resource?: string;
    columnResource: string;
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
        columnResource,
        actionRef,
        onRowActionClick,
        ...otherProps
    } = props;

    const domainService = new DomainService<T, Q>(resource);


    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [viewDrawerVisible, setViewDrawerVisible] = useState<boolean>(false);
    const [editDrawerVisible, setEditDrawerVisible] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [rowRecord, setRowRecord] = useState<T | undefined>(undefined);

    // 行操作点击处理
    const handleRowActionClick = (item: Action, record: T, action: React.Ref<ActionType>) => {

        const key = item.key;
        if (key === 'view') {
            // 查询详情
            domainService.findById(record.id).then((res) => {
                setRowRecord(res.data);
                setViewDrawerVisible(true);
            });
        } else if (key === 'edit') {
            // 查询详情
            domainService.findById(record.id).then((res) => {
                setRowRecord(res.data);
                setEditDrawerVisible(true);
            });
        } else if (key === 'delete') {
            // 删除
            const {confirm} = Modal;

            confirm({
                title: '您确认要删除该条目吗？',
                icon: <ExclamationCircleFilled/>,
                content: '删除后将无法恢复',
                onOk() {

                    domainService.deleteById(record.id).then(() => {
                        actionRef?.current?.reload();
                        message.success('删除成功');
                    });
                },
                onCancel() {
                    console.log('Cancel');
                },
            });


        }

        if (item.type === 'router-replace') {
            let routerString = "/resources/domain-entities/:resource";
            let to = routerString.replace(/:([^/]+)/, (match, group) => {
                return record[group] || match;
            });
            console.log("push", to)

            history.replace(to);
        }

        if (onRowActionClick) {
            onRowActionClick(key, record, action);
        }
    }

    const iconRender = (dom, entity, index, action, schem) => {
        return (<Icon type={'icon-' + entity.icon}/>);
    }

    const actionRender = (dom, entity, index, action, schema) => {

        console.log("schema", schema);

        const dropdownSize = 5;

        let strings = schema.actions as Action[] | [];

        let actions = [];

        let links = strings.length >= dropdownSize ? strings.slice(0, dropdownSize) : strings;

        // 生成操作链接
        links.forEach((item) => {
            actions.push(
                <Tooltip key={item.key} title={item.tips ? item.tips : item.name}>
                    <a
                        onClick={() => {
                            handleRowActionClick(item, entity, action);
                        }}
                    >
                        {item.name}
                    </a>
                </Tooltip>
            )
        });

        if (strings.length > dropdownSize) {

            let dropdowns = strings.slice(dropdownSize);
            // 把dropdowns转换成以key为key的对象

            const dropdownMap = dropdowns.reduce((acc, item) => {
                acc[item.key] = item;
                return acc;
            }, {});

            console.log("下拉对象", dropdownMap);

            actions.push(<TableDropdown
                key="actionGroup"
                onSelect={(key) => {
                    handleRowActionClick(dropdownMap[key], entity, action);
                }}
                menus={dropdowns}
            />)
        }


        console.log("action", entity)
        return actions;
    }

    const columnRenders = {
        icon: iconRender,
        option: actionRender
    };


    const uiService = new UIService(columnResource ? columnResource : resource);

    const [columns, setColumns] = useState<ProColumns[]>([]);


    const onDragSortEnd = (newDataSource: Menu[]) => {
        console.log('排序后的数据', newDataSource);
        domainService.sort(newDataSource).then(() => {
            console.log("actionRef", actionRef);
            actionRef?.current?.reload();
            if (props?.onDragSortEnd) {
                props.onDragSortEnd();
            }
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

    const toolbar = {
        actions: [
            <DrawerForm<T>
                key="create"
                title={'新建'}
                width={'60%'}
                placement={'left'}
                trigger={
                    <Button key="create" type={"primary"}>
                        新建
                    </Button>
                }
                onFinish={async (values) => {
                    console.log(values);
                    domainService.create(values).then(() => {
                        setCreateModalVisible(false);
                        actionRef?.current?.reload();
                        message.success('创建成功');
                    });
                }}

                onClose={() => setCreateModalVisible(false)}
                drawerProps={{
                    // 重置表单
                    destroyOnClose: true,
                }}
                columns={columns}
            />
        ]
    }

    return (
        <>
            {
                props.tableType === SupperTableType.Table
                && <ProTable {...props}
                             manualRequest={true}
                             columns={columns} request={request}

                             toolbar={toolbar}
                />
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
                                  toolbar={toolbar}
                />}
            {
                props.tableType === SupperTableType.Editable
                && <EditableProTable {...props} columns={columns}
                                     toolbar={toolbar}
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
            />


            <Modal
                title={'删除'}
                open={deleteModalVisible}
                onOk={() => {
                }}
                onCancel={() => setDeleteModalVisible(false)}
            />


        </>
    )
        ;
};

export default SupperTable;
