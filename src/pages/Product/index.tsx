import {history, useLocation, useParams} from 'umi';
import {PageContainer} from "@ant-design/pro-components";
import React, {useEffect, useState} from "react";
import {detail, list} from "@/services/domainService";
import ProCard from "@ant-design/pro-card";
import ProList from "@ant-design/pro-list/lib";
import {Product} from "@/services/Product";

const tabs = [
    {key: 'overview', tab: '概览'},
    {key: 'products', tab: '产品'},
];

export default () => {
    const {owner, product} = useParams(); // 通过 useParams 获取路由参数
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [productInfo, setProductInfo] = useState<Product>();
    let tabValue = queryParams.get('tab');
    // 如果查询参数不存在或为空，则设置默认值
    if (!tabValue) {
        tabValue = 'overview';
    }


    const handleTabChange = (newTab: string) => {
        history.push({pathname: `${location.pathname}?tab=${newTab}`});
    };

    useEffect(() => {

        detail('products', {product: product},)
            .then(res => {
                if (res.data === undefined) {
                    console.log(res.data);
                    history.push({pathname: '/404'})
                } else {
                    setProductInfo(res.data);
                    console.log("haha");
                }
            })


    }, []);


    return (
        <>
            <PageContainer
                tabList={tabs}
                tabActiveKey={tabValue}
                title={productInfo?.name}
                onTabChange={handleTabChange}
            >

                <ProCard
                    title={productInfo?.name}
                    subTitle={productInfo?.description}
                >

                  <p>当前产品：{product}</p>

                </ProCard>

                <hr/>

                <ProList<Product>
                    itemLayout="vertical"
                    rowKey="id"
                    params={{resource: 'products'}}
                    request={list}
                    metas={{
                        title: {
                            dataIndex: 'name'
                        },
                        subTitle: {},
                        type: {},
                        content: {},
                        actions: {},
                    }}
                />

            </PageContainer>
        </>
    );
}
