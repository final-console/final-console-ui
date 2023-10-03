import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {DragSortTable} from '@ant-design/pro-components';
import {Button, message} from 'antd';
import {SecurityMenu, SecurityMenuQuery} from "@/services/admin/typings";
import {createFromIconfontCN, PlusCircleFilled} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {DomainService} from "@/services/admin/DomainService";
import {BetaSchemaForm} from "@ant-design/pro-form";
import Settings from "../../../../../config/defaultSettings";
import {uiColumns} from "@/services/admin/UIService";

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
    formRef: React.MutableRefObject<SecurityMenuQuery>;
    actionRef: React.MutableRefObject<ActionType>;
    securityMenuQuery: SecurityMenuQuery;
}


const MenuChildren: React.FC<MenuChildrenProps> = (props) => {

    const securityMenuService = new DomainService<SecurityMenu, SecurityMenuQuery>('security-menus');

    const [columns, setColumns] = useState<ProColumns[]>([]);

    useEffect(() => {
        uiColumns('security-menus').then((res) => {
            setColumns(res.data.map(({valueType, ...item}) => ({
                ...item,
                render: valueType === 'icon' ? columnRenders[valueType] : undefined,
            })));
        });
    }, [])


    const handleDragSortEnd = (newDataSource: SecurityMenu[]) => {
        console.log('排序后的数据', newDataSource);
        securityMenuService.sort(newDataSource).then(() => {
            props.actionRef.current?.reload();
            props.onDragSortEnd();
            message.success('修改列表排序成功');
        });
    };

    return (
        <>
            <DragSortTable<SecurityMenu, SecurityMenuQuery>
                headerTitle="子菜单"
                columns={columns}
                rowKey="id"
                pagination={false}
                dragSortKey="sort"
                formRef={props.formRef}
                actionRef={props.actionRef}
                params={props.securityMenuQuery}
                request={async (params, sort) => await securityMenuService.list(params, sort)}
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
