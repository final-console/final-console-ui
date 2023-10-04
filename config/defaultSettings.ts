import {ProLayoutProps} from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
    pwa?: boolean;
    logo?: string;
} = {
    navTheme: 'realDark',
    // 拂晓蓝
    colorPrimary: '#FA541C',
    layout: 'mix',
    contentWidth: 'Fluid',
    fixedHeader: false,
    fixSiderbar: true,
    colorWeak: false,
    title: 'Final Admin',
    pwa: true,
    logo: 'https://prium.github.io/falcon/v3.15.0/assets/img/icons/spot-illustrations/falcon.png',
    iconfontUrl: '//at.alicdn.com/t/c/font_4273192_0vw7rctuo73.js',
    token: {
        // 参见ts声明，demo 见文档，通过token 修改样式
        //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
        pageContainer: {
            paddingBlockPageContainerContent: 0,
            paddingInlinePageContainerContent: 0
        }
    },
};

export default Settings;
