import AdminLayout from "@/layouts/AdminLayout";
import {history} from "@umijs/max";
import {useParams} from "umi";
import {SupperTableType} from "@/components/SuperTable";
import React, {useRef} from "react";
import {ActionType, ParamsType} from "@ant-design/pro-components";
import DomainPage from "@/components/DomainPage";

export default () => {

    const {resource} = useParams<Record<string, string>>();
    const actionRef = useRef<ActionType>();

    return (
        <AdminLayout
            title={'领域实体'}
            resource={'domain-entities'}
            menuHeaderRender={false}
            menuProps={{
                style: {
                    marginTop: '55px'
                }
            }}
            pathname={resource}
            onMenuClick={(item) => {
                history.replace('/admin/domain-resources/' + item.key);
            }}
        >
            <DomainPage<Record<string, any>, ParamsType>
                resource={resource}

                tableProps={{
                    actionRef: actionRef,
                    tableType: SupperTableType.DragSort,
                    onDragSortEnd: () => {
                        actionRef?.current?.reload();
                    },
                    onRowActionClick: (key, row, action) => {
                    }
                }}/>
        </AdminLayout>
    )
}
