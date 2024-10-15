import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import "./css/additem.css";
import Swal from 'sweetalert2';

export default function AddItem() {
    const navigate = useNavigate();
    const [ItemName, setName] = useState("");
    const [Quantity, setQuantity] = useState("");
    const [PreOrder, setPreOrder] = useState("");
    const [ExpDate, setExpDate] = useState("");
    const [ManDate, setManDate] = useState("");

    // State for error messages
    const [errors, setErrors] = useState({});

    function sendData(e) {
        e.preventDefault();

        // Reset error messages
        let validationErrors = {};

        // Validation checks
        if (!ItemName) {
            validationErrors.ItemName = "Item Name is required.";
        }
        if (!Quantity || Quantity <= 0) {
            validationErrors.Quantity = "Quantity must be greater than 0.";
        }
        if (!PreOrder || PreOrder <= 0) {
            validationErrors.PreOrder = "PreOrder Level must be greater than 0.";
        }
        if (!ExpDate) {
            validationErrors.ExpDate = "Expiration Date is required.";
        }
        if (!ManDate) {
            validationErrors.ManDate = "Manufacture Date is required.";
        }

        // If there are any validation errors, stop form submission and set the error messages
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const newUser = {
            ItemName,
            Quantity,
            PreOrder,
            ExpDate,
            ManDate,
        };

        axios.post("http://localhost:8070/inventory/add", newUser)
            .then(() => {
                // Success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: 'Inventory item has been added successfully.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/InventoryManageItems');
                });
            })
            .catch((err) => {
                // Error alert
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! ' + err.message,
                    confirmButtonText: 'Try Again'
                });
            });
    }

    // Adjust the top value based on whether there are errors
    const addDataStyle = {
        
        top: Object.keys(errors).length > 0 ? "70%" : "60%",
        transition: "top 0.3s ease"
    };

    return (
        <div>
            <section id="sidebar">
                <br />
                <img className='brandLogo' src={require('./img/wcLogo.png')} alt='logo' /><br /><br />
                <span className="brand">Wellness Kitchen</span>
                <ul className="side-menu top">
                    <li>
                        <a href={"/InventoryDashboard"}>
                            <i className='bx bxs-dashboard'></i>
                            <span className="text">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="/InventoryManageItems">
                            <i className='bx bx-user'></i>
                            <span className="text">Check Inventory Items</span>
                        </a>
                    </li>
                    <li>
                        <a href="/InventoryBackup">
                            <i className='bx bx-cloud bx-flip-horizontal'></i>
                            <span className="text">Backup & Restore</span>
                        </a>
                    </li>
                    <li>
                        <a href="/InventoriReport">
                            <i className='bx bx-cloud bx-flip-horizontal'></i>
                            <span className="text">Generate Report</span>
                        </a>
                    </li>
                    <li>
                        <a className="/login">
                            <i className='bx bx-exit'></i>
                            <span className="text">Logout</span>
                        </a>
                    </li>
                </ul>
            </section>

            <section id="content">
                <main>
                    <div className="head-title">
                        <div className="left">
                            <h1 style={{ fontSize: window.innerWidth <= 768 ? '1.5em' : '2.5em' }}>Inventory Management System</h1>
                            <ul className="breadcrumb">
                                <li>
                                    <a href="/">Home</a>
                                </li>
                                <li><i className='bx bx-chevron-right'></i></li>
                                <li>
                                    <a href="InventoryManageItems">Inventory Item</a>
                                </li>
                                <li><i className='bx bx-chevron-right'></i></li>
                                <li>
                                    <a href="/AddInvenItem" className='breadcrumb'>Add Inventory Item</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="table-data">
                        <div className="order">
                            <div className="head">
                                <h3>Add Inventory Item</h3>
                            </div>

                            <div className="add-data" style={addDataStyle}>
                                <form onSubmit={sendData} className="content">
                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                        <label htmlFor="name" className="col-sm-2 col-form-label">Item Name</label>
                                        <input
                                            type="text"
                                            className="item-input"
                                            id="name"
                                            placeholder="Enter Item Name"
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        {errors.ItemName && <p style={{ color: "red", fontSize: "0.8em" }}>{errors.ItemName}</p>}
                                    </div>

                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                        <label htmlFor="Quantity" className="col-sm-2 col-form-label">Quantity</label>
                                        <input
                                            type="number"
                                            className="item-input"
                                            id="Quantity"
                                            placeholder="Enter Quantity"
                                            onChange={(e) => setQuantity(e.target.value)}
                                            min="0"
                                            
                                        />
                                        {errors.Quantity && <p style={{ color: "red", fontSize: "0.8em" }}>{errors.Quantity}</p>}
                                    </div>

                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                        <label htmlFor="PreOrder" className="col-sm-2 col-form-label">PreOrder Level</label>
                                        <input
                                            type="number"
                                            className="item-input"
                                            id="PreOrder"
                                            placeholder="Enter PreOrder Level"
                                            onChange={(e) => setPreOrder(e.target.value)}
                                            min="0"
                                            
                                        />
                                        {errors.PreOrder && <p style={{ color: "red", fontSize: "0.8em" }}>{errors.PreOrder}</p>}
                                    </div>

                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                        <label htmlFor="ExpDate" className="col-sm-2 col-form-label">Exp Date</label>
                                        <input
                                            type="date"
                                            className="item-input"
                                            id="ExpDate"
                                            placeholder="Enter Expiration Date"
                                            onChange={(e) => setExpDate(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                        {errors.ExpDate && <p style={{ color: "red", fontSize: "0.8em" }}>{errors.ExpDate}</p>}
                                    </div>

                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                        <label htmlFor="ManDate" className="col-sm-2 col-form-label">Man Date</label>
                                        <input
                                            type="date"
                                            className="item-input"
                                            id="ManDate"
                                            placeholder="Enter Manufacture Date"
                                            onChange={(e) => setManDate(e.target.value)}
                                            max={new Date().toISOString().split("T")[0]}
                                        />
                                        {errors.ManDate && <p style={{ color: "red", fontSize: "0.8em" }}>{errors.ManDate}</p>}
                                    </div>

                                    <br />
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                                            <Link to={'/InventoryManageItems'}>
                                                <button type="reset" className="btn btn-danger btn-sm">Cancel</button>
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </section>
        </div>
    );
}
