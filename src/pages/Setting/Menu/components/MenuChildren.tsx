import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {DragSortTable} from '@ant-design/pro-components';
import {Button, message} from 'antd';
import {Menu, MenuQuery} from "@/services/admin/typings";
import {createFromIconfontCN, PlusCircleFilled} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {DomainService} from "@/services/admin/DomainService";
import {BetaSchemaForm} from "@ant-design/pro-form";
import Settings from "../../../../../config/defaultSettings";
import {UIService} from "@/services/admin/UIService";

const Icon = createFromIconfontCN({scriptUrl: Settings.iconfontUrl});

const iconRender = (_, record) => {
    return (<Icon type={'icon-' + record.icon}/>);
}

const columnRenders = {
    icon: iconRender,
};

export type MenuChildrenProps = {
    parentId: number;
    onDragSortEnd: () => void;
    formRef: React.MutableRefObject<MenuQuery>;
    actionRef: React.MutableRefObject<ActionType>;
    securityMenuQuery: MenuQuery;
}


const MenuChildren: React.FC<MenuChildrenProps> = (props) => {

    const menuService = new DomainService<Menu, MenuQuery>('menus');
    const uiService = new UIService('menu');

    const [dragColumn] = useState<ProColumns>({
        title: '排序',
        dataIndex: 'sort',
        width: '60',
    });

    const [columns, setColumns] = useState<ProColumns[]>([]);

    useEffect(() => {
        uiService.columns().then((res) => {
            let _columns: ProColumns[] = res.data.map(({valueType, ...item}) => ({
                ...item,
                render: valueType === 'icon' ? columnRenders[valueType] : undefined,
            }));
            _columns.push(dragColumn);
            setColumns(_columns);
        });
    }, [])


    const handleDragSortEnd = (newDataSource: Menu[]) => {
        console.log('排序后的数据', newDataSource);
        menuService.sort(newDataSource).then(() => {
            props.actionRef.current?.reload();
            props.onDragSortEnd();
            message.success('修改列表排序成功');
        });
    };

    return (
        <>
            <DragSortTable<Menu, MenuQuery>
                headerTitle="子菜单"
                columns={columns}
                rowKey="id"
                pagination={false}
                dragSortKey="sort"
                formRef={props.formRef}
                actionRef={props.actionRef}
                params={props.securityMenuQuery}
                request={async (params, sort) => await menuService.list(params, sort)}
                onDragSortEnd={handleDragSortEnd}
                search={false}
                toolbar={{
                    actions: [
                        <BetaSchemaForm
                            key={'add'}

                            trigger={<Button type="primary"><PlusCircleFilled/>点击我</Button>}
                            layoutType={'ModalForm'}
                            onFinish={async (values) => {
                                console.log(values);
                            }}
                            columns={columns}
                        />

                    ],
                }}
            />
        </>
    );
};

export default MenuChildren;
