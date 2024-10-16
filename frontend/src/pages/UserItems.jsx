import React, { useEffect, useState } from "react";
import { Modal, Card, Row, Col, Rate, Button, message, Image } from "antd";
import styled from "styled-components";
import { foodItemService } from "../services/food.item.service";

// Styled Components for layout
const ItemGrid = styled.div`
  padding: 20px;
  background-color: #ffae42;
  .ant-card {
    margin-bottom: 20px;
  }
  .ant-card-cover img {
    height: 200px;
    object-fit: cover;
  }
`;

const StyledButton = styled(Button)`
  margin-top: 15px;
  background-color: #ffae42;
  border: none;
  color: #fff;
  &:hover {
    background-color: #e88831;
  }
`;

const AddToCartButton = styled(Button)`
  margin-top: 15px;
  background-color: #ffae42;
  border: none;
  color: #fff;
  width: 100%;
  &:hover {
    background-color: #45a049;
  }
`;

const UserItems = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // For modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    foodItemService.getAllFoodItems().then((res) => {
      setFoodItems(res); // Assuming res is the array of food items
    });
  }, []);

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
    if (cart) {
      const exists = cart?.find((cartItem) => cartItem._id === item._id);

      if (exists) {
        message.error("Item is already in the cart");
      } else {
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        message.success("Item added to the cart");
      }
    }
  };

  return (
    <ItemGrid>
      <Row gutter={[16, 16]}>
        {foodItems.map((item) => (
          <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt={item.name} src={item.imageUrl} />}
              onClick={() => handleItemClick(item)}
            >
              <Card.Meta title={item.name} description={`LKR${item.price}`} />
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
              <strong>Price:</strong> ${selectedItem.price}
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
