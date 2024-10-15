import React from 'react';
import "./css/inventory.css";

const dashboardTable = ({ items, onUpdate, onDelete }) => {
  return (
    <div className="item-table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Expiration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.expirationDate}</td>
              <td className="table-actions">
                <button onClick={() => onUpdate(item)} className="update-btn">Update</button>
                <button onClick={() => onDelete(item)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="action-buttons">
        <button className="add-btn">Add Item</button>
        <button className="update-btn">Update Item</button>
        <button className="delete-btn">Delete Item</button>
      </div>
    </div>
  );
};

export default dashboardTable;
