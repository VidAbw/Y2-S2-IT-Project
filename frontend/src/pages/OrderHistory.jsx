import React, { useEffect, useState } from "react";
import { orderService } from "../services/order.service";
import {
  Table,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Spin,
  message,
  Modal,
  Button,
} from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons"; // Import DeleteOutlined
import styled from "styled-components";

const { Title } = Typography;

const OrderHistoryContainer = styled.div`
  background-color: #ffae42;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await orderService.getAllOrders();
        const userId = JSON.parse(localStorage.getItem("user"))["_id"];
        const userOrders = allOrders.filter((order) => order.userId === userId);
        setOrders(userOrders);
      } catch (error) {
        message.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewItems = (order) => {
    setSelectedOrder(order);
    setVisible(true);
  };

  const handleModalClose = () => {
    setVisible(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = (orderId) => {
    Modal.confirm({
      title: "Are you sure you want to cancel this order?",
      onOk: async () => {
        try {
          await orderService.updateOrderStatus(orderId, "CANCELED"); // Call the cancel order service
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId ? { ...order, status: "CANCELED" } : order
            )
          );
          message.success("Order canceled successfully.");
        } catch (error) {
          message.error("Failed to cancel order.");
        }
      },
    });
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => `LKR${text.toFixed(2)}`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green";
        if (status === "CANCELED") {
          color = "red";
        } else if (status === "SHIPPED") {
          color = "blue";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, order) => (
        <>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewItems(order)}
            style={{ marginRight: 8 }}
          >
            View Items
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleCancelOrder(order._id)}
            disabled={order.status === "CANCELED"}
          >
            Cancel Order
          </Button>
        </>
      ),
    },
  ];

  return (
    <OrderHistoryContainer>
      <Title level={2} style={{ color: "white" }}>
        Order History
      </Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="_id"
          pagination={false}
        />
      )}
      <Modal
        title={`Ordered Items for Order ID: ${selectedOrder?._id}`}
        visible={visible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedOrder && (
          <Row gutter={16}>
            {selectedOrder.items.map((item, index) => (
              <Col span={8} key={index}>
                <Card hoverable>
                  <Card.Meta
                    title={item.food.name}
                    description={`Quantity: ${
                      item.quantity
                    }, Price: LKR${item.price.toFixed(2)}`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Modal>
    </OrderHistoryContainer>
  );
};

export default OrderHistory;
