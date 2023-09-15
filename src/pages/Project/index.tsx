import {useParams} from 'umi';
import {PageContainer} from "@ant-design/pro-components";
const tabs = [
  {key: 'overview', tab: '概览'},
  {key: 'products', tab: '产品'},
];
export default () => {
  const {owner, product, project} = useParams(); // 通过 useParams 获取路由参数
  return (
    <>

      <PageContainer
      tabList={tabs}
      title={`${owner}:${project}:${project}`}
      >
        <p>所有者:{owner}</p>
        <p>产品:{product}</p>
        <p>项目:{project}</p>
      </PageContainer>
    </>
  );
}
