import React, {useState} from 'react';
import AdminLayout from "@/layouts/AdminLayout";
import {ActionType, PageContainer, ProColumns, ProDescriptions} from "@ant-design/pro-components";
import SuperTable, {SupperTableType} from "@/components/SuperTable";
import {Menu, MenuQuery} from "@/services/admin/typings";

const SuperAdminLayout = () => {

    const [menuQuery, setMenuQuery] = useState<MenuQuery>({parentId: -1, orders: 'sortValue'});
    const layoutActionRef = React.useRef<ActionType>();
    const actionRef = React.useRef<ActionType>();

    const descriptionsColumns: ProColumns[] = [
        {
            title: '名称',
            dataIndex: 'name',
            valueType: 'text',
        }
    ];


    return (
        <AdminLayout
            resource={'menu'}
            actionRef={layoutActionRef}
            onMenuClick={(item) => {
                console.log(item);
                setMenuQuery({...menuQuery, parentId: parseInt(item.key || '-1')})
            }}

            // 其他配置...
        >
            <PageContainer
                content={
                    <ProDescriptions
                        columns={descriptionsColumns}
                    />
                }
            >
                <SuperTable<Menu, MenuQuery>
                    actionRef={actionRef}
                    columnResource={'menus'}
                    resource={'menus'}
                    params={menuQuery}
                    search={false}
                    tableType={SupperTableType.DragSort}
                    onDragSortEnd={() => {
                        layoutActionRef.current?.reload();
                    }}
                />
            </PageContainer>
        </AdminLayout>
    );
}

export default SuperAdminLayout;
