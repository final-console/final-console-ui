import AdminLayout from "@/layouts/AdminLayout";
import {history} from "@umijs/max";
import {useParams} from "umi";
import SupperTable, {SupperTableType} from "@/components/SuperTable";
import React, {useRef, useState} from "react";
import {ActionType, PageContainer} from "@ant-design/pro-components";

export default () => {

    const {resource} = useParams();
    const [columnQuery, setColumnQuery] = useState({resource: resource, orders: 'sortValue'})
    const [actionQuery, setActionQuery] = useState({resource: resource, orders: 'sortValue'})
    const columnActionRef = useRef<ActionType>();

    const tabs = [
        {
            key: 'columns',
            tab: '数据列',
            children:
                <SupperTable
                    resource={'columns'}
                    columnResource={'columns'}
                    tableType={SupperTableType.DragSort}
                    search={false}
                    pagination={false}
                    manualRequest={true}
                    // formRef={menuChildrenFormRef}
                    actionRef={columnActionRef}
                    params={columnQuery}
                    // onDragSortEnd={() => layoutActionRef.current?.reload()}
                />
        },
        {
            key: 'actions', tab: '操作',
            children: <SupperTable
                resource={'actions'}
                columnResource={'actions'}
                params={actionQuery}
                tableType={SupperTableType.DragSort}
                search={false}
            />
        },
    ];
    const [tab, setTab] = useState<string>('columns');

    return (
        <AdminLayout
            title={'领域实体'}
            resource={'domain-entities'}
            pathname={resource}
            onMenuClick={(item) => {
                history.replace('/resources/domain-entities/' + item.key);
            }}
        >
            <PageContainer
                tabList={tabs}
                tabActiveKey={tab}
                onTabChange={setTab}
            >
            </PageContainer>
        </AdminLayout>
    )
}
