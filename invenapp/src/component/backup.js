import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid'; // Use uuid to generate unique codes

function InventoryBackup() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    // Fetch data
    useEffect(() => {
        function fetchData() {
            axios.get("http://localhost:8070/inventory/")
                .then((res) => {
                    setUsers(res.data);
                })
                .catch((err) => {
                    Swal.fire('Error!', err.message, 'error');
                });
        }
        fetchData();
    }, []);

    // Function to create and download the ZIP file with both JSON and CSV
    function downloadZip(jsonData, csvData) {
        const zip = new JSZip();

        // Get the current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];

        // Add JSON data (without ItemCode), with date in the filename
        zip.file(`inventory_backup_${currentDate}.json`, JSON.stringify(jsonData, null, 2));

        // Add CSV data (with ItemCode), with date in the filename
        zip.file(`inventory_backup_${currentDate}.csv`, csvData);

        // Generate the ZIP file with date in the filename
        zip.generateAsync({ type: "blob" }).then((content) => {
            const element = document.createElement('a');
            const url = URL.createObjectURL(content);
            element.href = url;
            element.download = `inventory_backup_${currentDate}.zip`; // Include date in the ZIP filename
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        });
    }


    // Convert JSON to CSV (with ItemCode)
    // Convert JSON to CSV (with ItemCode) and ensure dates are in YYYY-MM-DD format
    // Convert JSON to CSV (with ItemCode) and ensure dates are stored as text in YYYY-MM-DD format
    function jsonToCSV(jsonData) {
        const formattedData = jsonData.map(item => ({
            ...item,
            ExpDate: `"${new Date(item.ExpDate).toISOString().split('T')[0]}"`, // Format as "YYYY-MM-DD" to force text format
            ManDate: `"${new Date(item.ManDate).toISOString().split('T')[0]}"`, // Format as "YYYY-MM-DD" to force text format
        }));
        return Papa.unparse(formattedData);
    }



    function backup() {
        Swal.fire({
            title: 'Backup Confirmation',
            text: users.length + ' items in the database. Do you want to backup?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, backup it!',
            cancelButtonText: 'No, cancel!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.get("http://localhost:8070/inventory/")
                    .then((res) => {
                        const jsonData = res.data;
    
                        // Check if the database is empty
                        if (jsonData.length === 0) {
                            Swal.fire({
                                icon: 'info',
                                title: 'No Items to Backup',
                                text: 'The database is empty, no items available to backup.',
                                confirmButtonText: 'OK'
                            });
                            return; // Exit if no items are available for backup
                        }
    
                        // Remove ItemCode and _id from JSON backup
                        const jsonWithoutItemCode = jsonData.map(item => {
                            const { ItemCode, _id, ...rest } = item;  // Exclude ItemCode and _id
                            return rest;
                        });
    
                        const csvData = jsonToCSV(jsonData);  // CSV keeps ItemCode
    
                        // Call the downloadZip function to zip and download the files
                        downloadZip(jsonWithoutItemCode, csvData);
                        Swal.fire('Success!', 'Backup downloaded successfully!', 'success');
                    })
                    .catch((err) => {
                        Swal.fire('Error!', err.message, 'error');
                    });
            }
        });
    }
    
    



    // Restore data
    function restore(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = handleFileLoad;
        reader.readAsText(file);
    }




    function handleFileLoad(event) {
        try {
            const json = event.target.result;
            const data = JSON.parse(json);
    
            // Sanitize data by removing only _id (we will keep ItemCode from the JSON file)
            const sanitizedData = data.map(item => {
                const { _id, ...rest } = item;  // Exclude _id, but keep ItemCode
                return rest;
            });
    
            // Fetch the current inventory to check for any conflicts in ItemCodes
            axios.get("http://localhost:8070/inventory/")
                .then(async (res) => {
                    const allItems = res.data;
    
                    // Create a set of existing ItemCodes to check for conflicts
                    const existingItemCodes = new Set();
                    allItems.forEach(item => {
                        existingItemCodes.add(item.ItemCode);
                    });
    
                    // Find the highest existing ItemCode to start generating new ones
                    let highestItemCode = "I0000";
                    if (allItems.length > 0) {
                        highestItemCode = allItems.sort((a, b) => parseInt(b.ItemCode.substring(1)) - parseInt(a.ItemCode.substring(1)))[0].ItemCode;
                    }
    
                    let codeNumber = parseInt(highestItemCode.substring(1));  // Start with the highest existing code number
    
                    // Process each item one by one to ensure unique ItemCode
                    for (const item of sanitizedData) {
                        // Check if the ItemCode already exists in the database
                        if (existingItemCodes.has(item.ItemCode)) {
                            // If a duplicate is found, show SweetAlert and stop the process
                            Swal.fire({
                                icon: 'error',
                                title: 'This item already exists in the inventory, cannot duplicate item details!',
                                text: `ItemCodes already exists for items. Restore stopped.`,
                                confirmButtonText: 'OK'
                            });
                            return;  // Stop the process immediately if a duplicate is found
                        }
    
                        // If no duplicate is found, continue processing the item
                        codeNumber++;
                        item.ItemCode = 'I' + codeNumber.toString().padStart(4, '0');
                        console.log(`Generated new ItemCode: ${item.ItemCode} for item: ${item.ItemName}`);
    
                        // Ensure dates are in the correct format (YYYY-MM-DD)
                        if (item.ExpDate) {
                            item.ExpDate = new Date(item.ExpDate).toISOString().split('T')[0];
                        }
                        if (item.ManDate) {
                            item.ManDate = new Date(item.ManDate).toISOString().split('T')[0];
                        }
    
                        // Send the item (with its potentially new ItemCode) to the backend one by one
                        try {
                            await axios.post("http://localhost:8070/inventory/add", {
                                ...item,
                            });
                            console.log(`Item ${item.ItemName} with ItemCode ${item.ItemCode} added successfully.`);
                        } catch (err) {
                            console.error(`Error adding item ${item.ItemName}: ${err.message}`);
                        }
                    }
    
                    // Notify user that the restore process is complete
                    Swal.fire('Success!', 'Restore Successful!', 'success');
                    navigate('/InventoryManageItems');
    
                })
                .catch((err) => {
                    console.error("Error fetching inventory data:", err);
                    Swal.fire('Error!', 'Could not fetch existing inventory data: ' + err.message, 'error');
                });
        } catch (err) {
            console.error("Error parsing JSON file:", err);
            Swal.fire('Error!', 'Error parsing JSON file: ' + err.message, 'error');
        }
    }
    
    

    return (
        <div>
            <section id="sidebar">
                <br /><img className='brandLogo' src={require('./img/wcLogo.png')} alt='logo' /><br /><br />
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
                </ul>
            </section>

            <section id="content">
                <main>
                    <div className="head-title">
                        <div className="left">
                            <h1 style={{ textAlign: "center" }}>Backup and Restore</h1>
                        </div>
                    </div>

                    <div className="table-data-e">
                        <div className="order" style={{ marginBottom: "40px", marginTop: "100px" }}>
                            <div className="head">
                                <h3>Backup data</h3>
                            </div>
                            <button onClick={backup} className="backup-btn">Backup data</button>
                            <p className="blockquote-footer">Total Items: <Link to={'/InventoryManageItems'}>{users.length}</Link></p>
                        </div>
                        <div className="order">
                            <div className="head">
                                <h3>Restore data</h3>
                            </div>
                            <input type="file" onChange={restore} className="btn btn-secondary" />
                        </div>
                    </div>
                </main>
            </section>
        </div>
    );
}

export default InventoryBackup;
