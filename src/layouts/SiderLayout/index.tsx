import { useMenuStore } from '#/store/menu';
import { MenuDataItem, ProLayout } from '@ant-design/pro-components';
import React, { FC, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './index.module.less';
import layoutSettings from '#/config/proLayoutSetting';
import GlobalHeader from '#/components/Layout/GlobalHeader';
import { createBrowserHistory } from 'history';

const SiderLayout: FC = ({ children }) => {
  const menuStore = useMenuStore();
  const history = createBrowserHistory();

  const toggle = () => {
    menuStore.toggle = !menuStore.toggle;
  };

  const formatMenus = (menus?: MenuDataItem[]): MenuDataItem[] => {
    if (!menuStore.menus) return [];

    const menu = menus.map(({ icon, children: childrens, ...item }) => ({
      ...item,
      name: t(item.name),
      icon: icon,
      children: childrens && formatMenus(childrens),
    }));
    return menu;
  };

  const init = async () => {
    menuStore.fetchFavoriteMenus();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <ProLayout
      {...layoutSettings}
      className={styles['layout-content']}
      onCollapse={toggle}
      siderWidth={216}
      menuDataRender={() => {
        const menus = formatMenus(menuStore.menus);
        return menus;
      }}
      menuFooterRender={props => {
        if (props?.collapsed) return undefined;
        return menuStore.relatedMenus.length ? (
          <div style={{ height: '100px' }}>关联菜单</div>
        ) : undefined;
      }}
      headerRender={() => <GlobalHeader navItems={[]} isAdminPage={false} />}
      breadcrumbRender={(routers = []) =>
        routers.map(router => ({
          ...router,
          breadcrumbName: t(router.breadcrumbName),
        }))
      }
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      onPageChange={location => {
        if (location.pathname) {
          history.push(location.pathname);
        }
      }}
    >
      <Outlet />
    </ProLayout>
  );
};

export default SiderLayout;
