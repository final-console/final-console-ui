import {MenuDataItem, ProLayout} from "@ant-design/pro-layout";
import {getSecurityMenus} from "@/services/admin/security";
import React, {useRef, useState} from "react";
import {HeartOutlined, SmileOutlined} from "@ant-design/icons";
import {Button} from "antd";
import {ActionType, PageContainer, ProFormInstance} from "@ant-design/pro-components";
import MenuChildren from "./components/MenuChildren";
import MenuAuthorities from "./components/MenuAuthorities";
import {SecurityMenuQuery} from "@/services/admin/typings";


const IconMap = {
    smile: <SmileOutlined/>,
    heart: <HeartOutlined/>,
};

const loopMenuItem = (menus: any[]): MenuDataItem[] =>
    menus.map(({icon, routes, ...item}) => ({
        ...item,
        icon: icon && IconMap[icon as string],
        children: routes && loopMenuItem(routes),
    }));


export default () => {

    const layoutActionRef = useRef<ActionType>();
    const menuChildrenActionRef = useRef<ActionType>();
    const menuChildrenFormRef = useRef<ProFormInstance<SecurityMenuQuery>>();
    const [menuChildrenSecurityQuery, setMenuChildrenSecurityQuery] = useState<SecurityMenuQuery>({parentId: -1})

    const [parentId, setParentId] = useState<number>(-1);

    const tabs = [
        {key: 'menus', tab: '子菜单', children: <MenuChildren parentId={parentId}
                                                              formRef={menuChildrenFormRef}
                                                              actionRef={menuChildrenActionRef}
                                                              securityMenuQuery={menuChildrenSecurityQuery}
                                                              onDragSortEnd={() => layoutActionRef.current?.reload() }/>},
        {key: 'authorities', tab: '权限', children: <MenuAuthorities/>},
    ];

    const [tab, setTab] = useState<string>('menus');
    const [pathname, setPathname] = useState<string>('/');

    return (
        <ProLayout
            title={"菜单设置"}
            logo={"https://th.bing.com/th/id/R.c3ec64ad2cc5dbe33e74b212dc1b655b?rik=2iSUEjTG8e%2balA&riu=http%3a%2f%2fpic.616pic.com%2fys_b_img%2f00%2f15%2f34%2fMgf5DOge2w.jpg&ehk=YJ4I33FCI9wOYNRi%2bx%2fqT%2fvMy5cTmmq9hN5yX%2bwsEsc%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1"}
            collapsedButtonRender={false}
            fixSiderbar={true}
            actionRef={layoutActionRef}
            onMenuHeaderClick={() => history.back()}
            menuProps={{
                style: {}
            }}
            location={{
                pathname: pathname
            }}
            menu={{
                request: async () => {
                    // 查询所有菜单
                    const securityMenus = await getSecurityMenus({})
                    return loopMenuItem(securityMenus.data);
                },
            }}
            menuItemRender={(item, dom) => (
                <a
                    onClick={() => {
                        console.log(JSON.stringify(item));
                        setPathname(item.path || '/');
                        setParentId(parseInt(item.key || '-1'));
                        menuChildrenActionRef.current?.reload();
                        setMenuChildrenSecurityQuery({parentId: parseInt(item.key || '-1')});
                        // menuChildrenFormRef.current?.setFieldValue('parentId', parseInt(item.key || '-1'));
                    }}
                >
                    {dom}
                </a>
            )}
        >
            <PageContainer
                title={"菜单管理"}
                extra={[
                    <Button key="1" type="primary">
                        主操作
                    </Button>,
                ]}

                tabList={tabs}
                tabActiveKey={tab}
                onTabChange={setTab}
            >
            </PageContainer>
        </ProLayout>
    );
}
