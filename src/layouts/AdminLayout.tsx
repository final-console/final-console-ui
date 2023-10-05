import {MenuDataItem, ProLayout} from "@ant-design/pro-layout";
import Settings from "../../config/defaultSettings";
import {ProLayoutProps} from "@ant-design/pro-components";
import React, {useState} from "react";
import {UIService} from "@/services/admin/UIService";

export type AdminLayoutProps = {
    children: React.ReactNode;
    resource: string;
    pathname?: string;
    onMenuClick?: (item: MenuDataItem) => void;
} & ProLayoutProps

const AdminLayout: React.FC<AdminLayoutProps> = (props) => {

    const {
        children,
        resource,
        onMenuClick,
    } = props;

    const uiService = new UIService(resource);

    const loopMenuItem = (menus: any[]): MenuDataItem[] =>
        menus.map(({icon, routes, ...item}) => ({
            ...item,
            icon: icon && ('icon-' + icon),
            children: routes && loopMenuItem(routes),
        }));

    const [pathname, setPathname] = useState<string | undefined>(props.pathname);

    return (
        <ProLayout
            {...props}
            collapsedButtonRender={false}
            actionRef={props.actionRef}
            iconfontUrl={Settings.iconfontUrl}
            onMenuHeaderClick={() => history.back()}
            location={{pathname: pathname}}
            menu={{
                request: async () => {
                    // 查询所有菜单
                    const securityMenus = await uiService.menus({})
                    return loopMenuItem(securityMenus.data);
                },
            }}
            menuItemRender={(item, dom) => (
                <a
                    onClick={() => {
                        console.log(JSON.stringify(item));
                        setPathname(item.path || pathname)
                        if (onMenuClick) {
                            onMenuClick(item);
                        }
                    }}
                >
                    {dom}
                </a>
            )}
        >
            {children}
        </ProLayout>
    );
}
export default AdminLayout;
