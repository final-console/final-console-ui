import {MenuDataItem, ProLayout} from "@ant-design/pro-layout";
import {HeartOutlined, SmileOutlined} from "@ant-design/icons";

const IconMap = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />,
};

const defaultMenus = [
  {
    path: '/',
    name: 'welcome',
    icon: 'smile',
    routes: [
      {
        path: '/welcome',
        name: 'one',
        icon: 'smile',
        routes: [
          {
            path: '/welcome/welcome',
            name: 'two',
            icon: 'smile',
            exact: true,
          },
        ],
      },
    ],
  },
  {
    path: '/demo',
    name: 'demo',
    icon: 'heart',
  },
];

const loopMenuItem = (menus: any[]): MenuDataItem[] =>
  menus.map(({ icon, routes, ...item }) => ({
    ...item,
    icon: icon && IconMap[icon as string],
    children: routes && loopMenuItem(routes),
  }));

export default () => {

  const menus = [
    {
      path: '/',
      name: '欢迎',
      icon: 'smile',
      routes: [
        {
          path: '/welcome',
          name: 'one',
          routes: [
            {
              path: '/welcome/welcome',
              name: 'two',
              exact: true,
            },
          ],
        },
      ],
    },
    {
      path: '/demo',
      name: '例子',
    },
  ];

  return (
    <ProLayout
      title={"菜单管理111"}
      headerRender={false}
      menuHeaderRender={false}
      // menuFooterRender={false}
      menuExtraRender={false}
      collapsedButtonRender={false}
      fixSiderbar={true}
      style={{
        marginTop: '64px',
        height: 'calc(100vh - 64px)'
      }}
      menu={{ request: async () => loopMenuItem(defaultMenus) }}
    >
    </ProLayout>

  );
}
;

