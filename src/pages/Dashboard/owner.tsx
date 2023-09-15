import {useParams} from 'umi';

export default () => {
    const {owner} = useParams(); // 通过 useParams 获取路由参数
    return (
        <>
            <p>所有者:{owner}</p>
        </>
    );
}
