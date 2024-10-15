import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip } from 'chart.js';
import "./css/inventory.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip);

function InventoryDashboard() {
  const [users, setUsers] = useState([]);
  const [item, setitem] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  // Fetch data
  useEffect(() => {
    function getUsers() {
      axios.get("http://localhost:8070/inventory/")
        .then((res) => {
          setUsers(res.data);
        }).catch((err) => {
          alert(err.message);
        });
    }
    getUsers();
  }, []);

  // Fetch item data
  useEffect(() => {
    function getitem() {
      axios.get("http://localhost:8070/inventory/")
        .then((res) => {
          setitem(res.data);
        }).catch((err) => {
          alert(err.message);
        });
    }
    getitem();
  }, []);


  useEffect(() => {
    function getlowstock() {
      axios.get("http://localhost:8070/inventory/")
        .then((res) => {
          const preOrderData = res.data.map(item => item.PreOrder);
          setLowStock(preOrderData);
        }).catch((err) => {
          alert(err.message);
        });
    }
    getlowstock();
  }, []);



  const length = users.length;
  const number = item.length;
  const lowStockItems = users.filter(user => {
    // Assuming user.Quantity exists in the users array
    const preOrderValue = lowStock.find(item => item === user.PreOrder); // Match PreOrder value

    // Check if PreOrder value is greater than user.Quantity
    if (preOrderValue > user.Quantity) {
      console.log("Low Stock Item:", user); // Log the item in the console
      return true;
    }
    return false;
  });

  const groupedData = users.reduce((acc, user) => {
    const date = new Date(user.addedTime).toLocaleDateString(); // Format date
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += 1; // Increment item count for each date
    return acc;
  }, {});

   // Prepare chart data
   const chartData = {
    labels: Object.keys(groupedData), // X-axis (Dates)
    datasets: [{
      label: 'Items Added on Each Date',
      data: Object.values(groupedData), // Y-axis (Item count per date)
      backgroundColor: 'rgba(75,192,192,0.6)', // Bar color
      borderColor: 'rgba(75,192,192,1)', // Border color
      borderWidth: 1
    }]
  };


  // Prepare data for the pie chart
  const ItemCounts = {};
  users.forEach(user => {
    const model = user.ItemName; // Adjust this based on your actual property name
    if (model) {
      ItemCounts[model] = (ItemCounts[model] || 0) + 1;
    }
  });

  const pieData = {
    labels: Object.keys(ItemCounts),
    datasets: [{
      label: 'Item Count',
      data: Object.values(ItemCounts), // Corresponding counts
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#FFCD56', 
        '#4D5360', '#8E5EA2', '#FF6384', '#FF9F40', '#E7E9ED', '#36A2EB', '#FFCE56', 
        '#FF6384', '#4BC0C0', '#9966FF', '#FFCD56', '#4D5360', '#8E5EA2', '#FF6384', 
        '#FF9F40', '#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF', '#FFCD56', 
        '#4D5360', '#8E5EA2', '#FF6384', '#FF9F40', '#E7E9ED', '#36A2EB', '#FFCE56', 
        '#FF6384', '#4BC0C0', '#9966FF', '#FFCD56', '#4D5360', '#8E5EA2', '#FF6384', 
        '#FF9F40', '#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF'
      ],
      hoverBackgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#FFCD56', 
        '#4D5360', '#8E5EA2', '#FF6384', '#FF9F40', '#E7E9ED', '#36A2EB', '#FFCE56', 
        '#FF6384', '#4BC0C0', '#9966FF', '#FFCD56', '#4D5360', '#8E5EA2', '#FF6384', 
        '#FF9F40', '#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF', '#FFCD56', 
        '#4D5360', '#8E5EA2', '#FF6384', '#FF9F40', '#E7E9ED', '#36A2EB', '#FFCE56', 
        '#FF6384', '#4BC0C0', '#9966FF', '#FFCD56', '#4D5360', '#8E5EA2', '#FF6384', 
        '#FF9F40', '#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF'
      ]
      
    }]
  };

  // Chart options to customize tooltip
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (context.dataset.data) {
              label += `: ${context.dataset.data[context.dataIndex]}`;
            }
            return label;
          }
        }
      }
    }
  };

  // Get the last 5 added items
  const recentItems = users.slice(-5).reverse(); // Get the last 5 items and reverse for correct order

  return (
    <div>
      <section id="sidebar">
        <br /><img className='brandLogo' src={require('./img/wcLogo.png')} alt='logo' /><br /><br />
        <span className="brand">Wellness Kitchen</span>
        <ul className="side-menu top">
          <li>
            <a href={"/"}>
              <i className='bx bxs-dashboard'></i>
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

      <div className="">
        <section id="content">
          <main>
            <div className="head-title">
              <div className="left">
                <a href="/" className='' style={{ textDecoration: "none", textAlign: "center" }}><h1>Dashboard</h1></a>

              </div>
            </div>



            <div className="table-data-c">
              <div>
                <ul className="box-info">
                  <li>
                    <i className='bx bxs-user' undefined ></i>
                    <span className="text">
                      <h3>{length}</h3>
                      <p>Inventory Records</p>
                    </span>
                  </li>

                  <li>
                    <i className='bx bxs-user' undefined ></i>
                    <span className="text">
                      <h3>{lowStockItems.length}</h3>
                      <p >Low Stock Count <span className="icon-wrapper-b" >
                        <FontAwesomeIcon icon={faTriangleExclamation} className="blinking-icon-b" />
                      </span></p>
                    </span>
                  </li>
                </ul>

                <div className="charts-container">
                  {/* Line chart to display items added over time */}
                  <div className="chart-Line" >
                    <h4 className="head">Line Chart</h4>
                    <Line data={chartData} options={options} />
                  </div>

                  {/* Pie chart */}
                  <div className="chart-Pie" >
                    <h4 className="head">Pie Chart</h4>
                    <Pie data={pieData} options={options} />
                  </div>

                </div>
                <div className="notification-roler">
                  {/* Table to display recently added items */}
                  <div className="recent-items">
                    <div className="head" style={{ marginBottom: "28px" }}>
                      <h3>Recently Added Items</h3>
                    </div>
                    <div className="recent-item">

                      <table>
                        <thead>
                          <tr>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Item Quantity</th>
                            <th>Item Added Date</th>
                          </tr>
                        </thead>
                      </table>
                      <div className="recentRoling-box">
                        <div className="recentRoling-content">
                          <table>
                            <tbody className="recentscrolling-table">
                              {recentItems.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.ItemCode}</td>
                                  <td>{item.ItemName}</td>
                                  <td>{item.Quantity}</td>
                                  <td>{new Date(item.addedTime).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>

                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  </div>



                  {/* Table to display Low stock items */}
                  <div className="Low-items">
                    <div className="head">
                      <h3>Low Stock Alert <span className="icon-wrapper">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="blinking-icon" />
                      </span></h3>



                    </div>
                    <div className="Low-item">

                      <table>
                        <thead>
                          <tr>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Item Quantity</th>
                          </tr>
                        </thead>
                      </table>
                      <div className="LowRoling-box">
                        <div className="LowRoling-content">
                          <table>
                            <tbody className="scrolling-table">
                              {lowStockItems.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.ItemCode}</td>
                                  <td>{item.ItemName}</td>
                                  <td>{item.Quantity}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}

export default InventoryDashboard;
