import {history, useLocation, useParams} from 'umi';
import {PageContainer} from "@ant-design/pro-components";
import React, {useEffect, useState} from "react";
import {Owner} from "@/services/Owner";
import {detail, list} from "@/services/domainService";
import ProCard from "@ant-design/pro-card";
import ProList from "@ant-design/pro-list/lib";
import {Product} from "@/services/Product";
import {useModel} from "@umijs/max";
import {Button} from "antd";

const tabs = [
    {key: 'overview', tab: '概览'},
    {key: 'products', tab: '产品'},
];

export default () => {
    const {owner} = useParams(); // 通过 useParams 获取路由参数
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [ownerInfo, setOwnerInfo] = useState<Owner>();
    let tabValue = queryParams.get('tab');
    // 如果查询参数不存在或为空，则设置默认值
    if (!tabValue) {
        tabValue = 'overview';
    }


    if(!owner || owner === 'dashboard'){
        const { initialState } = useModel('@@initialState');

        // 获取登录用户信息
        const currentUser = initialState?.currentUser;

        if (currentUser) {
            history.push({pathname: `/${currentUser.username}`})
        } else {
            return <div>Not logged in.</div>;
        }

    }



    const handleTabChange = (newTab: string) => {
        history.push({pathname: `${location.pathname}?tab=${newTab}`});
    };

    useEffect(() => {

        detail('owners', {owner: owner},)
            .then(res => {
                if (res.data === undefined) {
                    console.log(res.data);
                    history.push({pathname: '/404'})
                } else {
                    setOwnerInfo(res.data);
                    console.log("haha");
                }
            })


    }, []);


    return (
        <>
            <PageContainer
                tabList={tabs}
                tabProps={{
                  type: "card"
                }}
                tabActiveKey={tabValue}
                title={owner}
                onTabChange={handleTabChange}
                extra={[
                  <Button key="3">操作</Button>,
                  <Button key="2">操作</Button>,
                  <Button key="1" type="primary">
                    主操作
                  </Button>,
                ]}
                footer={[
                  <Button key="rest">重置</Button>,
                  <Button key="submit" type="primary">
                    提交
                  </Button>,
                ]}
            >

                <ProCard
                    title={ownerInfo?.name}
                    subTitle={ownerInfo?.description}
                >
                    <p>所有者:{ownerInfo?.name}</p>
                </ProCard>

                <hr/>

                <ProList<Product>
                    itemLayout="vertical"
                    rowKey="id"
                    params={{resource: 'products'}}
                    request={list}
                    metas={{
                        title: {},
                        avatar: {},
                    }}
                />

            </PageContainer>
        </>
    );
}
