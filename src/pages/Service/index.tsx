import {useParams} from 'umi';

export default () => {
    const {owner,product,project,repository,service} = useParams(); // 通过 useParams 获取路由参数
    return (
        <>
            <p>所有者:{owner}</p>
            <p>产品:{product}</p>
            <p>项目:{project}</p>
            <p>仓库:{repository}</p>
            <p>服务:{service}</p>
        </>
    );
}
