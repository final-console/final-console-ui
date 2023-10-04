import {ActionType, ParamsType} from "@ant-design/pro-components";
import {SupperTableType} from "@/components/SuperTable";
import {useRef} from "react";
import {useParams} from "umi";
import PageTable from "@/components/PageTable";

export default () => {

    const {resources} = useParams<Record<string, string>>();

    const actionRef = useRef<ActionType>();

    return (
        <PageTable<Record<string, any>, ParamsType> resource={resources} tableProps={{
            actionRef: actionRef,
            tableType: SupperTableType.DragSort,
            onDragSortEnd: () => {
                actionRef?.current?.reload();
            },
            onRowActionClick: (key, row, action) => {
            }
        }}/>
    )
}


