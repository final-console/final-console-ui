import {MenuDataItem, ProLayout} from "@ant-design/pro-layout";
import {getSecurityMenus} from "@/services/admin/security";
import React, {useRef, useState} from "react";
import {Button} from "antd";
import {ActionType, PageContainer} from "@ant-design/pro-components";
import Settings from "../../../../config/defaultSettings";


const loopMenuItem = (menus: any[]): MenuDataItem[] =>
    menus.map(({icon, routes, ...item}) => ({
        ...item,
        icon: icon && ('icon-' + icon),
        children: routes && loopMenuItem(routes),
    }));

export default () => {

    const layoutActionRef = useRef<ActionType>();
    const menuChildrenActionRef = useRef<ActionType>();

    const [pathname, setPathname] = useState<string>('/');

    return (
        <ProLayout
            title="数据表"
            logo={"https://th.bing.com/th/id/R.c3ec64ad2cc5dbe33e74b212dc1b655b?rik=2iSUEjTG8e%2balA&riu=http%3a%2f%2fpic.616pic.com%2fys_b_img%2f00%2f15%2f34%2fMgf5DOge2w.jpg&ehk=YJ4I33FCI9wOYNRi%2bx%2fqT%2fvMy5cTmmq9hN5yX%2bwsEsc%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1"}
            collapsedButtonRender={false}
            fixSiderbar={true}
            actionRef={layoutActionRef}
            iconfontUrl={Settings.iconfontUrl}
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
                        let parentId = parseInt(item.key || '-1');

                        if (parentId !== -1) {
                            parentId = Math.abs(parentId);
                        }

                        setPathname(item.path || '/');
                        menuChildrenActionRef.current?.reload();
                    }}
                >
                    {dom}
                </a>
            )}
        >
            <PageContainer
                extra={[
                    <Button key="1" type="primary">
                        主操作
                    </Button>,
                ]}

            >
            </PageContainer>
        </ProLayout>
    );
}
