import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  FireOutlined
} from "@ant-design/icons";
import UserManager from "../components/Admin/UserManager";
import ItemManager from "./ItemManager";
import OrderManager from "./OrderManager";


const { Header, Content, Sider } = Layout;

const AdminDashboard = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const onMenuItemClicked = (index) => {
    setActiveIndex(index);
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["user-manager"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item
            onClick={() => {
              onMenuItemClicked(1);
            }}
            key="user-manager"
            icon={<UserOutlined />}
          >
            User Manager
          </Menu.Item>

          <Menu.Item
            onClick={() => {
              onMenuItemClicked(2);
            }}
            key="item-manager"
            icon={<AppstoreOutlined />}
          >
            Item Manager
          </Menu.Item>
          
          <Menu.Item
            onClick={() => {
              onMenuItemClicked(3);
            }}
            key="order-manager"
            icon={<ShoppingCartOutlined />}
          >
            Order Manager
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {activeIndex === 1 && <UserManager />}
          {activeIndex === 2 && <ItemManager />}
          {activeIndex === 3 && <OrderManager />}

        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
