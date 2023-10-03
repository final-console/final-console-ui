import {QuestionCircleOutlined} from '@ant-design/icons';
import {SelectLang as UmiSelectLang} from '@umijs/max';
import React, {useCallback} from 'react';
import {SettingOutlined} from "@ant-design/icons/lib/icons";
import HeaderDropdown from "@/components/HeaderDropdown";
import {useModel} from "@@/exports";
import {MenuInfo} from "rc-menu/lib/interface";
import {flushSync} from "react-dom";
import {GlobalHeaderRightProps} from "@/components/RightContent/AvatarDropdown";

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
  );
};

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};

export const Setting: React.FC<GlobalHeaderRightProps> = () => {

  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'menu') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, menu: true }));
        });
        return;
      }
    },
    [setInitialState],
  );



  const menuItems = [
        {
          key: 'menu',
          icon: <SettingOutlined />,
          label: '菜单设置',
        },
        {
          type: 'divider' as const,
        },

  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      <SettingOutlined />
    </HeaderDropdown>
  );
};
