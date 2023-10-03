import {MenuDataItem, ProLayout} from "@ant-design/pro-layout";
import {getSecurityMenus} from "@/services/admin/security";
import React, {useRef, useState} from "react";
import {HeartOutlined, SmileOutlined} from "@ant-design/icons";
import {Button} from "antd";
import {ActionType, PageContainer} from "@ant-design/pro-components";
import MenuChildren from "./components/MenuChildren";
import MenuAuthorities from "./components/MenuAuthorities";


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


    const tabs = [
        {key: 'menus', tab: '子菜单', children: <MenuChildren onDragSortEnd={() => layoutActionRef.current?.reload() }/>},
        {key: 'authorities', tab: '权限', children: <MenuAuthorities/>},
    ];

    const [tab, setTab] = useState<string>('menus');
    const [pathname, setPathname] = useState<string>('/');

    return (
        <ProLayout
            title={"菜单设置"}
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
                        setPathname(item.path || '/');
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
