import SupperTable, {SupperTableProps} from "@/components/SuperTable";
import {PageContainer, PageContainerProps, ParamsType} from "@ant-design/pro-components";
import React from "react";

export type PageTableProps<
    T extends Record<string, any>,
    Q extends ParamsType = ParamsType,
> = {
    resource: string;
    children: React.ReactNode;
    tableProps?: SupperTableProps<T, Q>;
} & PageContainerProps

function PageTable<
    T extends Record<string, any>,
    Q extends ParamsType = ParamsType,
>(props: PageTableProps<T, Q>) {

    const {
        resource,
        tableProps
    } = props;

    return (
        <PageContainer
            {...props}
            token={{
                paddingBlockPageContainerContent: 24,
                paddingInlinePageContainerContent: 40
            }}
        >
            <SupperTable<T, Q>
                {...tableProps}
                resource={resource}
            />
        </PageContainer>
    )

}

export default PageTable;
