import SupperTable, {SupperTableProps, SupperTableType} from "@/components/SuperTable";
import {PageContainer, PageContainerProps, ParamsType} from "@ant-design/pro-components";
import React, {useState} from "react";
import {Button, Drawer, Tabs, Tooltip} from "antd";
import {SettingOutlined} from "@ant-design/icons";

export type DomainPageProps<
    T extends Record<string, any>,
    Q extends ParamsType = ParamsType,
> = {
    resource: string;
    children: React.ReactNode;
    tableProps?: SupperTableProps<T, Q>;
} & PageContainerProps

function DomainPage<
    T extends Record<string, any>,
    Q extends ParamsType = ParamsType,
>(props: DomainPageProps<T, Q>) {

    const {
        resource,
        tableProps
    } = props;

    const [settingVisiable, setSettingVisiable] = useState<boolean>(false);

    const tabs = [
        {
            key: 'columns',
            label: '数据列',
            children:
                <SupperTable
                    resource={'columns'}
                    columnResource={'columns'}
                    tableType={SupperTableType.DragSort}
                    search={false}
                    pagination={false}
                    // formRef={menuChildrenFormRef}
                    // actionRef={columnActionRef}
                    params={{resource: resource, orders: 'sortValue'}}
                    // onDragSortEnd={() => layoutActionRef.current?.reload()}
                />
        },
        {
            key: 'actions', label: '操作',
            children: <SupperTable
                resource={'actions'}
                columnResource={'actions'}
                params={{resource: resource, orders: 'sortValue'}}
                tableType={SupperTableType.DragSort}
                search={false}
            />
        },
    ];
    const [tab, setTab] = useState<string>('columns');

    return (
        <PageContainer
            {...props}
            token={{
                paddingBlockPageContainerContent: 24,
                paddingInlinePageContainerContent: 40
            }}
            extra={[
                <Tooltip key={'setting'} title={"设置数据列和事件"}>
                    <Button key="setting" icon={<SettingOutlined/>} onClick={() => setSettingVisiable(true)}></Button>
                </Tooltip>
            ]}
        >
            <SupperTable<T, Q>
                {...tableProps}
                resource={resource}
            />
            <Drawer
                open={settingVisiable}
                placement={'bottom'}
                height={'50%'}
                onClose={() => setSettingVisiable(false)}
            >
                <Tabs
                    defaultActiveKey={tab}
                    items={tabs}
                    onChange={setTab}
                ></Tabs>
            </Drawer>
        </PageContainer>
    )

}

export default DomainPage;
