import React, {useRef, useState} from "react";
import {ActionType, PageContainer, ProFormInstance} from "@ant-design/pro-components";
import {MenuQuery} from "@/services/admin/typings";
import Settings from "../../../../config/defaultSettings";
import AdminLayout from "@/layouts/AdminLayout";
import SupperTable, {SupperTableType} from "@/components/SuperTable/SupperTable";

export default () => {

    const layoutActionRef = useRef<ActionType>();
    const menuChildrenActionRef = useRef<ActionType>();
    const menuChildrenFormRef = useRef<ProFormInstance<MenuQuery>>();
    const [menuQuery, setMenuQuery] = useState({parentId: -1})

    const tabs = [
        {
            key: 'menus',
            tab: '子菜单',
            children: <SupperTable
                parentId={-1}
                resource='menus'
                tableType={SupperTableType.DragSort}
                search={false}
                formRef={menuChildrenFormRef}
                actionRef={menuChildrenActionRef}
                params={menuQuery}
                onDragSortEnd={() => layoutActionRef.current?.reload()}/>
        },
        {
            key: 'authorities', tab: '权限',
            children: <SupperTable
                resource='authorities'
                tableType={SupperTableType.DragSort}
                search={false}
            />
        },
    ];

    const [tab, setTab] = useState<string>('menus');

    return (
        <AdminLayout
            title="菜单设置"
            logo={"https://th.bing.com/th/id/R.c3ec64ad2cc5dbe33e74b212dc1b655b?rik=2iSUEjTG8e%2balA&riu=http%3a%2f%2fpic.616pic.com%2fys_b_img%2f00%2f15%2f34%2fMgf5DOge2w.jpg&ehk=YJ4I33FCI9wOYNRi%2bx%2fqT%2fvMy5cTmmq9hN5yX%2bwsEsc%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1"}
            resource={'menu'}
            collapsedButtonRender={false}
            fixSiderbar={true}
            actionRef={layoutActionRef}
            iconfontUrl={Settings.iconfontUrl}
            pathname={'/'}
            onMenuHeaderClick={() => history.back()}
            onMenuClick={(item) => {
                console.log(JSON.stringify(item));
                let parentId = parseInt(item.key || '-1');

                if (parentId !== -1) {
                    parentId = Math.abs(parentId);
                }

                menuChildrenActionRef.current?.reload();
                setMenuQuery({parentId: parentId});
                // menuChildrenFormRef.current?.setFieldValue('parentId', parseInt(item.key || '-1'));
            }}
        >
            <PageContainer
                tabList={tabs}
                tabActiveKey={tab}
                onTabChange={setTab}
            >
            </PageContainer>
        </AdminLayout>
    );
}
