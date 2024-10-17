import React, { useEffect, useState } from "react";
import { Table, Button, Input, message } from "antd";
import { orderService } from "../services/order.service";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styled from "styled-components";
import { OrderStatus } from "../constants";

const Container = styled.div`
  padding: 20px;
  background-color: #e3a857; /* Background color for a clean look */
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: white; /* Darker title for better visibility */
  margin-bottom: 20px;
`;

const SearchInput = styled(Input)`
  margin-bottom: 20px;
  width: 300px;
  &:hover {
    border-color: #ff8c00;
  }
`;

const GeneratePDFButton = styled(Button)`
  margin-bottom: 20px;
  margin-left: 7px;
  padding: 10px;
  background-color: #ff8c00; /* Primary color */
  border: none;
  color: white;
  &:hover {
    background-color: #ffa700 !important; /* Lighter on hover */
    color: #fff !important;
  }
`;

const ShipButton = styled(Button)`
  background-color: orange;
  color: black;
  margin-right: 8px; /* Use margin-right for spacing */
  border: none; /* Remove border if necessary */
  &:hover {
    background-color: #e3ab57 !important; /* Change color on hover */
    color: white; /* Change text color on hover */
    cursor: pointer; /* Change cursor to pointer */
  }
`;

const DeleteButton = styled(Button)`
  background-color: red; /* Custom color for delete */
  color: white;
  border: none;
  &:hover {
    background-color: darkred; /* Darker color on hover */
    color: white; /* Maintain text color */
    cursor: pointer; /* Change cursor to pointer */
  }
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
        console.log(fetchedOrders);
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
      head: [["ID", "Name", "Email", "Total Price", "Status"]],
      body: filteredOrders.map((order) => [
        order._id,
        order.name,
        order.email,
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

  const handleUpdateStatus = async (orderId, newStatus, userEmail) => {
    const confirmShip = window.confirm(
      "Are you sure you want to ship this order?"
    );
    if (confirmShip) {
      try {
        await orderService.updateOrderStatus(orderId, newStatus, userEmail);
        message.success(`Order status updated to ${newStatus}.`);
        setFilteredOrders(
          filteredOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } catch (error) {
        console.error("Error updating order:", error);
        message.error("Failed to update order status.");
      }
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.userEmail.localeCompare(b.userEmail),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => `LKR ${text.toFixed(2)}`,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <ShipButton
            className="Button1"
            onClick={() =>
              handleUpdateStatus(
                record._id,
                OrderStatus.SHIPPED,
                record.userEmail
              )
            }
            style={{
              marginRight: 8,
              backgroundColor: "orange",
              color: "white",
            }}
            type="primary"
          >
            Ship
          </ShipButton>
          <DeleteButton
            className="Button2"
            onClick={() => handleDelete(record._id)}
            type="danger"
          >
            Delete
          </DeleteButton>
        </span>
      ),
    },
  ];

  return (
    <Container>
      <Title>Order Manager</Title>
      <SearchInput
        placeholder="Search orders by name"
        onChange={handleSearch}
      />
      <GeneratePDFButton onClick={generatePDF}>Generate PDF</GeneratePDFButton>
      <Table
        dataSource={filteredOrders}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </Container>
  );
};

export default OrderManager;
