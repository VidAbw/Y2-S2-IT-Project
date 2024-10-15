import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import axios from "axios";
import { Link } from "react-router-dom";
import "../component/css/InventoryReport.css"
import 'jspdf-autotable';

export default function InventoriReport() {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    function getUsers() {
        axios
            .get("http://localhost:8070/inventory/")
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    useEffect(() => {
        getUsers();
    }, []);

    // Trigger search whenever the search input changes
    useEffect(() => {
        searchUser();
    }, [searchInput]); // This will trigger the search whenever the searchInput changes

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
            getUsers(); // Reset the user list if search input is cleared
        }
    }

    function handlePdfGeneration() {
        const doc = new jsPDF();

        // Set the title
        doc.setFontSize(16); // Set font size for the title
        doc.text('Inventory Report', 14, 22); // Add title at (x=14, y=22)

        // Add some space between the title and the table
        doc.setFontSize(12); // Set font size for the table
        doc.text('Generated Report', 14, 30); // Subtitle, optional

        // Set table header
        const header = [["Item Code", "Item Name", "Quantity", "PreOrder", "Exp Date", "Man Date"]];

        // Add data rows
        const data = users.map(user => [
            user.ItemCode,
            user.ItemName,
            user.Quantity,
            user.PreOrder,
            user.ExpDate,
            user.ManDate
        ]);

        // Add table to document (starting below the title)
        doc.autoTable({
            head: header,
            body: data,
            startY: 40 // Position the table below the title
        });

        // Download the PDF document
        doc.save('InventoryReport.pdf');
    }

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
            <section id="content">
                <br />
                <br />
                <main>
                    <div className="head-title">
                        <div className="left-report">
                            <h1>Inventory Details Report</h1>
                            <br />
                        </div>
                        {/* Search Bar */}
                        <div className="right">
                            <div
                                className="search-container"
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",

                                }}
                            >
                                <div className="col-auto" style={{ width: "25%" }}> {/* Adjust width as needed */}
                                    <div className="input-group mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inlineFormInputGroup"
                                            placeholder="Search..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                        />
                                        <div
                                            className="input-group-prepend"
                                            onClick={searchUser}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="input-group-text">
                                                <i className="bx bx-search"></i> {/* Search button */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="table-data-d">
                        <div className="">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>Item code</th>
                                        <th>Item name</th>
                                        <th>Quantity</th>
                                        <th>PreOrder</th>
                                        <th>Exp date</th>
                                        <th>Man date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((i, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{i.ItemCode}</td>
                                                <td>{i.ItemName}</td>
                                                <td>{i.Quantity}</td>
                                                <td>{i.PreOrder}</td>
                                                <td>{i.ExpDate}</td>
                                                <td>{i.ManDate}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <button className='backup-btn' onClick={handlePdfGeneration}>
                                Generate PDF
                            </button>
                        </div>
                    </div>

                </main>
            </section>
        </body>
    );
}
