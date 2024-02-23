import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { closeNavigation } from '../store/slices/state'
import { IoIosClose } from "react-icons/io";
const SideNavigation = () => {
    const sideNavigation = useSelector((state) => state.commonState.sideNavigation)
    const dispatch = useDispatch()
    const handleCloseNavigation = () => {
        dispatch(closeNavigation());
    };
    return (
        <>
           <div className={`w-64 ${sideNavigation ? 'block fixed h-screen z-50 bg-secondary' : 'hidden'} md:block`}>
            <button className='btn btn-circle flex justify-center md:hidden ms-auto me-3' onClick={handleCloseNavigation}><IoIosClose size="24" /></button>
            <ul className="menu bg-secondary w-56 rounded-box h-screen">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/category">Category</Link></li>
                <li><Link to="/subcategory">SubCategory</Link></li>
                <li><Link to="/product">Products</Link></li>
            </ul>
        </div>
        </>
    )
}

export default SideNavigation
