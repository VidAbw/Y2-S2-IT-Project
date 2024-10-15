import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/dashboard.css";
import Swal from 'sweetalert2';

function InventoryManageUseres() {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    // Fetch data for search
    function getUsers() {
        axios
            .get("http://localhost:8070/inventory/")
            .then((res) => {
                console.log(res.data);
                setUsers(res.data);
            })
            .catch((err) => {
                alert(err.message);
            });
        setSearchInput("");
    }

    useEffect(() => {
        getUsers();
    }, []);

    function deletedata(i) {
        // SweetAlert confirmation
        Swal.fire({
            title: `Do you want to delete "${i.ItemName}"?`,
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F97211',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // If confirmed, proceed to delete the item
                axios
                    .delete("http://localhost:8070/inventory/delete/" + i._id)
                    .then(() => {
                        // Show success message
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: `"${i.ItemName}" has been deleted successfully.`,
                            confirmButtonText: 'OK'
                        });
                        getUsers(); // Refresh the list after deletion
                    })
                    .catch((err) => {
                        // Show error message
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: `Something went wrong: ${err.message}`,
                            confirmButtonText: 'OK'
                        });
                    });
            }
        });
    }

    // Function to delete all items
    function deleteAllItems() {
        Swal.fire({
            title: 'Are you sure?',
            text: "All items will be deleted! This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F97211',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete all!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete("http://localhost:8070/inventory/delete")  // Updated route
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'All items have been deleted successfully.',
                            confirmButtonText: 'OK'
                        });
                        getUsers(); // Refresh the list after deletion
                    })
                    .catch((err) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: `Something went wrong: ${err.message}`,
                            confirmButtonText: 'OK'
                        });
                    });

            }
        });
    }

    // Search data
    function searchUser() {
        if (searchInput !== "") {
            axios
                .get(`http://localhost:8070/inventory/search/${searchInput}`)
                .then((res) => {
                    setUsers(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                });
        } else {
            getUsers();
        }
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            searchUser();
        }, 1000);
        return () => clearTimeout(delayDebounceFn);
    }, [searchInput]);

    return (
        <body>
            <div>
                <section id="sidebar">
                    <br /><img className='brandLogo' src={require('./img/wcLogo.png')} alt='logo' /><br /><br />
                    <span className="brand">Wellness Kitchen</span>
                    <ul className="side-menu top">
                        <li>
                            <a href={"/"}>
                                <i className='bx bxs-dashboard' ></i>
                                <span className="text">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="/InventoryManageItems">
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
            <div className="content-bg">
                <section id="content" className="content">
                    <main>
                        <div className="head-title">
                            <div>
                                <h1 style={{ marginLeft: "27px" }}>Inventory Item</h1>
                            </div>
                            <div className="header-container">

                                <div className="left">

                                    <ul className="breadcrumb">
                                        <li>
                                            <a href="/">Home</a>
                                        </li>
                                        <li>
                                            <a className="breadcrumb" href="/InventoryBackup">
                                                Backup & Restore
                                            </a>
                                        </li>
                                        <li>
                                            <a className="breadcrumb" href="/InventoriReport">
                                                Generate Report
                                            </a>
                                        </li>
                                    </ul>

                                </div>

                                {/* Search Bar */}
                                <div className="right">
                                    <div className="search-container">
                                        <div className="col-auto">
                                            <div className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="inlineFormInputGroup"
                                                    placeholder="Search..."
                                                    value={searchInput}
                                                    onChange={(e) => setSearchInput(e.target.value)}
                                                />
                                                <div className="input-group-prepend" onClick={getUsers}>
                                                    <div className="input-group-text">
                                                        <i className="bx bx-x"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className="head" style={{ textAlign: "center" }}>
                            <a href="/AddInvenItem"><button className="btn-download" >
                                <i className="bx bx-user-plus"></i>
                                <span className="text">Add Inventory Item</span>
                            </button></a>

                            <button className="btn-download" style={{ marginLeft: "5px" }} onClick={deleteAllItems}>
                                <i className="bx bx-user-plus"></i>
                                <span className="text">Delete All Items</span>
                            </button>
                        </div>
                        <div className="table-data-e">
                            <div className="order">
                                <div >
                                    <div className="invent-table">
                                        <table className="Inventory-table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Item Code</th>
                                                    <th>Item Name</th>
                                                    <th>Quantity</th>
                                                    <th>PreOrder</th>
                                                    <th>Exp date</th>
                                                    <th>Man date</th>
                                                    <th>Edit Details</th>
                                                    <th>Remove Items</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((i, index) => {
                                                    return (
                                                        <tr key={i._id}>
                                                            <td>{index + 1}</td>
                                                            <td>{i.ItemCode}</td>
                                                            <td>{i.ItemName}</td>
                                                            <td>{i.Quantity}</td>
                                                            <td>{i.PreOrder}</td>
                                                            <td>{i.ExpDate}</td>
                                                            <td>{i.ManDate}</td>
                                                            <td><Link to={`/EditUser/${i._id}`}><button type="button" className="btn btn-outline-success btn-sm" style={{ width: "100%" }}>Edit</button></Link></td>
                                                            <td><button type="button" className="btn btn-outline-danger btn-sm" onClick={(() => deletedata(i))} style={{ width: "80%" }}>Remove</button></td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        </body>
    );
}

export default InventoryManageUseres;
