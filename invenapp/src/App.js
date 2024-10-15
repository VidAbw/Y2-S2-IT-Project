import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./component/InventoriesDashboard"
import InventoryItems from "./component/InventoryItemList"
import AddNewItem from "./component/AddItem"
import EditUser from "./component/EditItem"
import InventoryBackup from "./component/backup"
import InventoriReport from "./component/GenarateReport"


function App() {
  return (
    <Router> 
      <div>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/InventoryManageItems" element={<InventoryItems/>}/>
          <Route path="/AddInvenItem" element={<AddNewItem/>}/>
          <Route path="/EditUser/:id" element={<EditUser/>}/>
          <Route path="/InventoryBackup" element={<InventoryBackup/>}/>
          <Route path="/InventoriReport" element={<InventoriReport/>}/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
