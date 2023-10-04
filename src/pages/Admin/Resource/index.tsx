import {ActionType, PageContainer} from "@ant-design/pro-components";
import SupperTable, {SupperTableType} from "@/components/SuperTable";
import {useRef} from "react";
import {useParams} from "umi";

export default () => {

    const {resources} = useParams<Record<string, string>>();

    const actionRef = useRef<ActionType>();

    return (
        <PageContainer
            token={{
                paddingBlockPageContainerContent: 24,
                paddingInlinePageContainerContent: 40
            }}
        >
            <SupperTable resource={resources}
                         tableType={SupperTableType.Table}
                         actionRef={actionRef}
                         manualRequest={false}/>
        </PageContainer>
    )
}


