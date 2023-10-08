import {MenuDataItem, ProLayout} from "@ant-design/pro-layout";
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

    const [pathname, setPathname] = useState<string | undefined>(props.pathname);
    const [menuData, setMenuData] = useState<MenuDataItem[]>([]);

    /**
     * 当前选中的菜单
     */
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [selectKeys, setSelectKeys] = useState<string[]>([]);

    function findDifferentElements(arr1, arr2) {
        const diff1 = arr1.filter(item => !arr2.includes(item));
        const diff2 = arr2.filter(item => !arr1.includes(item));
        return [...diff1, ...diff2];
    }

    /**
     * 查询树形结构中的元素
     * @param key
     * @param tree
     */
    function findTreeElementByKey(key: string, tree: MenuDataItem[]): MenuDataItem | undefined {
        for (const node of tree) {
            if (key === node.key) {
                return node;
            }
            if (node.children) {
                const result = findTreeElementByKey(key, node.children);
                if (result) return result;
            }
        }
        return undefined;
    }

    const handleSelect = (keys: string[]) => {

        if (keys.length === 0) {
            console.log("没有菜单被选中", keys);
            return;
        }

        let key = keys[keys.length - 1];
        console.log("菜单被选中：", keys, key);

        setSelectKeys([key])

        if (onMenuClick) {
            let menuItemData = findTreeElementByKey(key, menuData);
            onMenuClick(menuItemData);
        }

    }

    const handleMenuOpenChange = (keys) => {
        console.log("当前：", openKeys, "目标：", keys);
        if (openKeys.length === keys.length) {
            console.log("相同，同级切换", keys);
        } else if (openKeys.length < keys.length) {
            console.log("多，展开", keys);
            let differentElements = findDifferentElements(openKeys, keys);
            console.log("不同的keys", differentElements);
            if (differentElements.length > 0 && differentElements.length === 1) {
                handleSelect(differentElements);
            }
        } else {
            console.log("少，收缩", keys);
            let differentElements = findDifferentElements(openKeys, keys);
            console.log("不同的keys", differentElements);
            if (differentElements.length > 0 && differentElements.length === 1) {
                handleSelect(differentElements);
            }
        }


    }


    return (
        <ProLayout
            {...props}
            location={{pathname: pathname}}
            selectedKeys={selectKeys}
            onSelect={(key) => {
                console.log("onSelect", key);
                handleSelect(key);
            }}
            menu={{
                ...props.menu,
                request: async (params, defaultMenuData) => {
                    let menus = await uiService.menus({});
                    setMenuData(menus.data);
                    return menus.data;
                }
            }}
            onOpenChange={(openKeys) => {
                console.log("onOpenChange", openKeys);
                handleMenuOpenChange(openKeys);
                setOpenKeys(openKeys);
            }}
            menuItemRender={(item, dom) => (
                <a
                    onClick={() => {
                        setPathname(item.path || pathname)
                        // handleMenuOpenChange([item.key]);
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
