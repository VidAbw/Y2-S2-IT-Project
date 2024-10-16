import React, { useEffect, useState } from "react";
import { Table, Button, Input, message } from "antd";
import { orderService } from "../services/order.service";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styled from "styled-components";
import { OrderStatus } from "../constants";

const SearchInput = styled(Input)`
  margin-bottom: 20px;
  width: 300px;
  color: black;
`;

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const fetchedOrders = await orderService.getAllOrders();
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } catch (error) {
        message.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = orders.filter((order) =>
      order.name.toLowerCase().includes(value)
    );
    setFilteredOrders(filtered);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Order List", 10, 10);
    doc.autoTable({
      head: [["ID", "Name", "Total Price", "Status"]],
      body: filteredOrders.map((order) => [
        order._id,
        order.name,
        order.totalPrice,
        order.status,
      ]),
    });
    doc.save("orders.pdf");
  };

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (confirmDelete) {
      try {
        await orderService.deleteOrder(orderId);
        message.success("Order deleted successfully.");
        setFilteredOrders(
          filteredOrders.filter((order) => order._id !== orderId)
        );
      } catch (error) {
        message.error("Failed to delete the order.");
      }
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      message.success(`Order status updated to ${newStatus}.`);
      setFilteredOrders(
        filteredOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      message.error("Failed to update order status.");
    }
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
      render: (text) => `LKR ${text.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button
            onClick={() => handleUpdateStatus(record._id, OrderStatus.SHIPPED)}
            style={{ marginRight: 8 }}
          >
            Ship
          </Button>
          <Button onClick={() => handleDelete(record._id)} type="danger">
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>Order Manager</h2>
      <SearchInput
        placeholder="Search orders by name"
        onChange={handleSearch}
      />
      <Button
        type="primary"
        onClick={generatePDF}
        style={{
          marginBottom: 20,
          marginLeft: 7,
          padding: 10,
        }}
      >
        Generate PDF
      </Button>
      <Table
        dataSource={filteredOrders}
        columns={columns}
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
};

export default OrderManager;
