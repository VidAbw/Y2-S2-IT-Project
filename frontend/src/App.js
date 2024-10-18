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
import Footer from "./components/Common/Footer";
import PrivacyPolicy from "./pages/Footer_pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/Footer_pages/TermsOfService";
import ContactUs from "./pages/Footer_pages/ContactUs";
import CreateReservation from './components/Reservation/CreateReservation';
import UserReservation from './components/Reservation/UserReservation';
import ReservationsList from './components/Reservation/ReservationsList';
import UpdateReservation from './components/Reservation/UpdateReservation';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "./components/Sidebar.jsx";


const Wrapper = styled.div`
  width: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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
              <Content>
                <Login />
              </Content>
              <Footer />
            </Wrapper>
          }
        />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route
          path="/item-manager"
          element={
            <Wrapper>
              <Header />
              <Content>
                <UserItems />
              </Content>
              <Footer />
            </Wrapper>
          }
        />
        <Route
          path="/order-history"
          element={
            <Wrapper>
              <Header />
              <Content>
                <OrderHistory />
              </Content>
              <Footer />
            </Wrapper>
          }
        />
        <Route path="/order-manager" element={<OrderManager />} />
        
        <Route
          path="/register"
          element={
            <Wrapper>
              <Header />
              <Content>
                <Register />
              </Content>
              <Footer />
            </Wrapper>
          }
        />
        <Route
          path="/cart"
          element={
            <Wrapper>
              <Header />
              <Content>
                <MyCart />
              </Content>
              <Footer />
            </Wrapper>
          }
        />
        <Route
          path="/"
          element={
            <Wrapper>
              <Header />
              <Content>
                <UserHome />
              </Content>
              <Footer />
            </Wrapper>
          }
        />

        <Route
          path="/privacy-policy"
          element={
            <Wrapper>
              <Header />
              <Content>
                <PrivacyPolicy />
              </Content>
              <Footer />
            </Wrapper>
          }
        />
        <Route
          path="/terms-of-service"
          element={
            <Wrapper>
              <Header />
              <Content>
                <TermsOfService />
              </Content>
              <Footer />
            </Wrapper>
          }
        />
        <Route
          path="/contact-us"
          element={
            <Wrapper>
              <Header />
              <Content>
                <ContactUs />
              </Content>
              <Footer />
            </Wrapper>
          }
        />

        {/* Wrapped Reservation Routes */}

        <Route path="/reservation-list" element={<Sidebar component={ReservationsList} />} />
        <Route path="/reservations/update/:id" element={<Sidebar component={UpdateReservation} />} />
        {/* <Route path="/manage-complaints" element={<Sidebar component={ComplaintsList} />} /> */}
        <Route
          path="/user/reservation"
          element={
            <Wrapper>
              <Header />
              <Content>
                <UserReservation />
              </Content>
              <Footer />
            </Wrapper>
          }
        />
        <Route
          path="/reservations/create"
          element={
            <Wrapper>
              <Header />
              <Content>
                <CreateReservation />
              </Content>
              <Footer />
            </Wrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}



export default App;
