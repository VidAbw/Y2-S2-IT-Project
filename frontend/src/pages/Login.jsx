// Login.js
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import styled from "styled-components";
import userService from "../services/user.service";
import { Link, useNavigate } from "react-router-dom";

const LoginContainer = styled.div`
  width: 600px;
  margin: 90px auto;
  padding: 80px;
  background-color: #ffe4cc;
  background-image: url("../images/backgroundLR.png");
  border-radius: 70px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StyledButton = styled(Button)`
  background-color: #f09c42;
  border: none;
  color: #fff;
  width: 100%;
  font-size: 16px;
  height: 45px;
  &:hover {
    background-color: #e88831;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
`;

const LinkText = styled.p`
  font-size: 14px;
  color: #333;
  margin-top: 10px;
  a {
    color: #f09c42;
    text-decoration: none;
  }
`;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      await userService.login(values);
      message.success("Login successful!");
      form.resetFields();
      navigate("/");
    } catch (error) {
      message.error(error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Title>Login</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <StyledButton htmlType="submit" loading={loading}>
            Login
          </StyledButton>
        </Form.Item>
      </Form>

      <LinkText>
        Don’t have an account? <Link to="/register">Signup</Link>
      </LinkText>

      <LinkText>
        <a href="/forgot-password">Forgot password?</a>
      </LinkText>
    </LoginContainer>
  );
};

export default Login;
