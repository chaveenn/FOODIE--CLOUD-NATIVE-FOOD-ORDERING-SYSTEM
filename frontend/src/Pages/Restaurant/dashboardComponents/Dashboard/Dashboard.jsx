import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Overview from '../Sections/Overview'
import Menu from '../Sections/Menu'
import Orders from '../Sections/Orders'
import MyRestaurant from '../Sections/MyRestaurant'
import MyProfile from '../Sections/MyProfile'
import Location from '../Sections/Location'
import NotFound from '../../../NotFound' 
import AddMenu from '../Sections/Add-Menu'
import OrderDetails from '../Sections/OrderDetails'
import './Dashboard.css'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className={`dashboard-container ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <Sidebar open={sidebarOpen} />
      <div className="main-content">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="content-wrapper">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="menu" element={<Menu />} />
            <Route path="orders" element={<Orders />} />
            <Route path="my-restaurant" element={<MyRestaurant />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="location" element={<Location />} />
            <Route path="add-menu" element={<AddMenu />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            

            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Dashboard