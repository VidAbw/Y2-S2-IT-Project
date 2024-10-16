import React, { useEffect, useState } from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Rate,
  Button,
  message,
  Image,
  Slider,
  Input,
} from "antd";
import styled from "styled-components";
import { foodItemService } from "../services/food.item.service";

// Styled Components for layout
const ItemGrid = styled.div`
  padding: 40px;
  background-color: #ffae42;
  min-height: 100vh;

  .ant-card {
    margin-bottom: 30px;
    border-radius: 15px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
  }

  .ant-card-cover img {
    height: 220px;
    object-fit: cover;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  .ant-card-meta-title {
    font-size: 1.2em;
    font-weight: bold;
  }

  .ant-card-meta-description {
    color: #333;
    font-weight: 600;
  }
`;

const StyledButton = styled(Button)`
  margin-top: 15px;
  background-color: #e88831;
  border: none;
  color: #fff;
  border-radius: 20px;
  padding: 5px 20px;

  &:hover {
    background-color: #ffb74d !important;
    color: white !important;
  }
`;

const AddToCartButton = styled(Button)`
  margin-top: 15px;
  background-color: orange;
  border: none;
  color: #fff;
  width: 100%;
  border-radius: 20px;
  font-weight: bold;
  padding: 10px;

  &:hover {
    background-color: #ffb74d !important;
    color: white !important;
  }
`;

const SearchInput = styled(Input)`
  margin-bottom: 20px;
  border-radius: 80px;
  border-color: #fff;
  box-shadow: #fff;
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: center;
  display: flex;

  &:focus {
    border-color: #fff;
    box-shadow: #fff;
  }
`;

const PriceSlider = styled(Slider)`
  margin-bottom: 30px;

  .ant-slider-rail {
    background-color: #fff;
  }

  .ant-slider-track {
    background-color: #ffa500;
  }

  .ant-slider-handle {
    border: 2px solid #ffa500;
    background-color: #fff;
  }
`;

const UserItems = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // For modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range
  const [searchTerm, setSearchTerm] = useState(""); // For search

  useEffect(() => {
    foodItemService.getAllFoodItems().then((res) => {
      setFoodItems(res); // Assuming res is the array of food items
      setFilteredItems(res); // Initially, show all food items
    });
  }, []);

  // Filter items by price range
  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
    filterItems(searchTerm, value);
  };

  // Search items
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterItems(term, priceRange);
  };

  // Filter items based on search term and price range
  const filterItems = (term, priceRange) => {
    const filtered = foodItems.filter(
      (item) =>
        item.name.toLowerCase().includes(term.toLowerCase()) &&
        item.price >= priceRange[0] &&
        item.price <= priceRange[1]
    );
    setFilteredItems(filtered);
  };

  // Handle modal open
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  // Add item to cart
  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item already exists in the cart
    const exists = cart?.find((cartItem) => cartItem._id === item._id);

    if (exists) {
      message.error("Item is already in the cart");
    } else {
      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));
      message.success("Item added to the cart");
    }
  };

  return (
    <ItemGrid>
      <SearchInput
        style={{ marginBottom: "5px" }}
        placeholder="Search food items..."
        value={searchTerm}
        onChange={handleSearchChange}
        allowClear
      />
      <h2 style={{ color: "#fff", fontSize: "15px" }}>Price Range</h2>
      <PriceSlider
        style={{ marginBottom: "60px" }}
        range
        value={priceRange}
        min={0}
        max={3000} // Adjust max value as necessary
        onChange={handlePriceRangeChange}
        step={10}
        marks={{
          0: "LKR 0",
          500: "LKR 500",
          1000: "LKR 1000",
          1500: "LKR 1500",
          2000: "LKR 2000",
          2500: "LKR 2500",
          3000: "LKR 3000",
        }}
      />

      <Row gutter={[24, 24]}>
        {filteredItems.map((item) => (
          <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt={item.name} src={item.imageUrl} />}
              onClick={() => handleItemClick(item)}
            >
              <Card.Meta title={item.name} description={`LKR ${item.price}`} />
              <Rate disabled defaultValue={item.stars} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Item Details Modal */}
      <Modal
        visible={isModalVisible}
        title={selectedItem?.name}
        onCancel={handleCancel}
        footer={[
          <StyledButton key="close" onClick={handleCancel}>
            Close
          </StyledButton>,
        ]}
      >
        {selectedItem && (
          <div>
            <Image src={selectedItem.imageUrl} />
            <p>
              <strong>Price:</strong> LKR {selectedItem.price}
            </p>
            <p>
              <strong>Cook Time:</strong> {selectedItem.cookTime}
            </p>
            <p>
              <strong>Health Benefits:</strong>{" "}
              {selectedItem.healthBenefits.join(", ")}
            </p>
            <p>
              <strong>Origins:</strong> {selectedItem.origins.join(", ")}
            </p>
            <p>
              <strong>Tags:</strong> {selectedItem.tags.join(", ")}
            </p>
            <Rate disabled defaultValue={selectedItem.stars} />

            {/* Add to Cart Button */}
            <AddToCartButton onClick={() => addToCart(selectedItem)}>
              Add to Cart
            </AddToCartButton>
          </div>
        )}
      </Modal>
    </ItemGrid>
  );
};

export default UserItems;
