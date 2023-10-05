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
            logo={"https://th.bing.com/th/id/R.c3ec64ad2cc5dbe33e74b212dc1b655b?rik=2iSUEjTG8e%2balA&riu=http%3a%2f%2fpic.616pic.com%2fys_b_img%2f00%2f15%2f34%2fMgf5DOge2w.jpg&ehk=YJ4I33FCI9wOYNRi%2bx%2fqT%2fvMy5cTmmq9hN5yX%2bwsEsc%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1"}
            resource={'domain-entities'}
            onMenuHeaderClick={() => history.back()}
            fixedHeader={false}
            menuProps={{
                style: {}
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
