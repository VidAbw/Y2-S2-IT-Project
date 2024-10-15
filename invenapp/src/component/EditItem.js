import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export default function InventoryEditUser() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [users, setUsers] = useState({
        ItemCode: '',
        ItemName: '',
        Quantity: '',
        PreOrder: '',
        ExpDate: '',
        ManDate: '',
    });

    // State for error messages
    const [errors, setErrors] = useState({});

    // Fetch data
    useEffect(() => {
        function getUsers() {
            axios.get(`http://localhost:8070/inventory/get/${id}`)
                .then((res) => {
                    console.log(res);
                    setUsers(res.data.admin);
                }).catch((err) => {
                    alert(err.message);
                });
        }
        getUsers();
    }, [id]);

    const handleChange = (e) => {
        setUsers({
            ...users,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset error messages
        let validationErrors = {};

        // Validation checks
        if (!users.ItemName) {
            validationErrors.ItemName = "Item Name is required.";
        }
        if (!users.Quantity || users.Quantity <= 0) {
            validationErrors.Quantity = "Quantity must be greater than 0.";
        }
        if (!users.PreOrder || users.PreOrder <= 0) {
            validationErrors.PreOrder = "PreOrder Level must be greater than 0.";
        }
        if (!users.ExpDate) {
            validationErrors.ExpDate = "Expiration Date is required.";
        }
        if (!users.ManDate) {
            validationErrors.ManDate = "Manufacture Date is required.";
        }

        // If there are any validation errors, stop form submission and set the error messages
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Submit data
        axios.put(`http://localhost:8070/inventory/update/${id}`, users)
            .then((response) => {
                console.log(response.data);

                // Show success SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Inventory item has been updated successfully.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/InventoryManageItems'); // Redirect after the alert is confirmed
                });
            })
            .catch((error) => {
                console.log(error);

                // Show error SweetAlert
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: `Something went wrong: ${error.message}`,
                    confirmButtonText: 'Try Again'
                });
            });
    };

    return (
        <body>
            <div>
                <section id="sidebar">
                    <br /><img className='brandLogo' src={require('./img/wcLogo.png')} alt='logo' /><br /><br />
                    <span className="brand">Wellness Kitchen</span>
                    <ul className="side-menu top">
                        <li>
                            <a href={"/InventoryDashboard"}>
                                <i className='bx bxs-dashboard' ></i>
                                <span className="text">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="/InventoryManageUseres">
                                <i className='bx bx-user'></i>
                                <span className="text">Check Inventory Item</span>
                            </a>
                        </li>
                        <li>
                            <a href="/InventoryBackup">
                                <i className='bx bx-cloud bx-flip-horizontal' ></i>
                                <span className="text">Backup & Restore</span>
                            </a>
                        </li>
                        <li>
                            <a href="/InventoriReport">
                                <i className='bx bx-cloud bx-flip-horizontal' ></i>
                                <span className="text">Generate Report</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </div>
            <section id="content">
                <main>
                    <div className="head-title">
                        <div className="left">
                            <h1>Check Inventory Item</h1>
                            <ul className="breadcrumb">
                                <li>
                                    <a href="/">Home</a>
                                </li>
                                <li><i className='bx bx-chevron-right'></i></li>
                                <li>
                                    <a href="/InventoryManageUseres">Check Inventory Item</a>
                                </li>
                                <li><i className='bx bx-chevron-right'></i></li>
                            </ul>
                        </div>
                    </div>
                    <div className="head">
                        <h3>Edit Inventory Item</h3>
                    </div>
                    <div className="table-data-e">
                        <div className="order">
                            <form onSubmit={handleSubmit} style={{ marginLeft: "5%", marginRight: "5%" }}>

                                <div className="col-sm-6 mb-3 mb-sm-0">
                                    <label htmlFor="ItemCode" className="col-sm-2 col-form-label">Item Code</label>
                                    <input
                                        type="text"
                                        className="item-input"
                                        name="ItemCode"
                                        id="ItemCode"
                                        value={users.ItemCode}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>

                                <div className="col-sm-6 mb-3 mb-sm-0">
                                    <label htmlFor="ItemName" className="col-sm-2 col-form-label">Item Name</label>
                                    <input
                                        type="text"
                                        className="item-input"
                                        name="ItemName"
                                        id="ItemName"
                                        value={users.ItemName}
                                        onChange={handleChange}
                                    />
                                    {errors.ItemName && <p style={{ color: "red", fontSize: "0.8em" }}>{errors.ItemName}</p>}
                                </div>

                                <div className="col-sm-6 mb-3 mb-sm-0">
                                    <label htmlFor="Quantity" className="col-sm-2 col-form-label">Quantity</label>
                                    <input
                                        type="text"
                                        className="item-input"
                                        id="Quantity"
                                        name="Quantity"
                                        value={users.Quantity}
                                        onChange={handleChange}
                                    />
                                    {errors.Quantity && <p style={{ color: "red", fontSize: "0.8em" }}>{errors.Quantity}</p>}
                                </div>

                                <div className="col-sm-6 mb-3 mb-sm-0">
                                    <label htmlFor="PreOrder" className="col-sm-2 col-form-label">Pre-Order</label>
                                    <input
                                        type="text"
                                        className="item-input"
                                        id="PreOrder"
                                        name="PreOrder"
                                        value={users.PreOrder}
                                        onChange={handleChange}
                                    />
                                    {errors.PreOrder && <p style={{ color: "red", fontSize: "0.8em" }}>{errors.PreOrder}</p>}
                                </div>

                                <div className="col-sm-6 mb-3 mb-sm-0">
                                    <label htmlFor="ExpDate" className="col-sm-2 col-form-label">Exp date</label>
                                    <input
                                        type="date"
                                        className="item-input"
                                        id="ExpDate"
                                        name="ExpDate"
                                        value={users.ExpDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                    {errors.ExpDate && <p style={{ color: "red", fontSize: "0.8em" }}>{errors.ExpDate}</p>}
                                </div>

                                <div className="col-sm-6 mb-3 mb-sm-0">
                                    <label htmlFor="ManDate" className="col-sm-2 col-form-label">Man date</label>
                                    <input
                                        type="date"
                                        className="item-input"
                                        id="ManDate"
                                        name="ManDate"
                                        value={users.ManDate}
                                        onChange={handleChange}
                                        max={new Date().toISOString().split("T")[0]}
                                    />
                                    {errors.ManDate && <p style={{ color: "red", fontSize: "0.8em" }}>{errors.ManDate}</p>}
                                </div>

                                <br />
                                <div className="form-group row">
                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                        <button type="submit" className="btn btn-primary btn-sm">Save</button>
                                        <Link to={'/InventoryManageItems'}>
                                            <button type="reset" className="btn btn-secondary btn-sm">Cancel</button>
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </section>
        </body>
    );
}
