import React from 'react'
import { Link } from 'react-router-dom'
Link
const SideNavigation = () => {
    return (
        <div>
            <ul className="menu bg-secondary w-56 rounded-box h-screen">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="category">Category</Link></li>
                <li><Link to="subcategory">SubCategory</Link></li>
                <li><Link to="product">Products</Link></li>
            </ul>
        </div>
    )
}

export default SideNavigation