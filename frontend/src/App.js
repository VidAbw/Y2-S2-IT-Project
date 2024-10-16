import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import OrderHistory from "./pages/OrderHistory";
import OrderManager from "./pages/OrderManager";
import UserHome from "./pages/UserHome";
import Header from "./components/Common/Header";
import styled from "styled-components";
import Register from "./pages/Register";
import UserItems from "./pages/UserItems";
import MyCart from "./pages/MyCart";
import CheckoutView from "./pages/CheckoutView";
const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
`;
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Wrapper>
              <Header />
              <Login />
            </Wrapper>
          }
        />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route
          path="/item-manager"
          element={
            <Wrapper>
              {" "}
              <Header />
              <UserItems />
            </Wrapper>
          }
        />
        <Route
          path="/order-history"
          element={
            <Wrapper>
              <Header />
              <OrderHistory />
            </Wrapper>
          }
        />
        <Route path="/order-manager" element={<OrderManager />} />
        <Route
          path="/checkout"
          element={
            <Wrapper>
              {" "}
              <Header />
              <CheckoutView />{" "}
            </Wrapper>
          }
        />
        <Route
          path="/register"
          element={
            <Wrapper>
              <Header />
              <Register />
            </Wrapper>
          }
        />
        <Route
          path="/cart"
          element={
            <Wrapper>
              <Header />
              <MyCart />
            </Wrapper>
          }
        />
        <Route
          path="/"
          element={
            <Wrapper>
              <Header />
              <UserHome />
            </Wrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
