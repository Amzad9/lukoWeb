import React from 'react'
import { Outlet } from 'react-router-dom'
import SideNavigation from '../components/SideNavigation'
import Navigation from '../components/Navigation'
function Home() {
    return (
        <div>
            <div className='flex'>
             
                    <SideNavigation />
                
                <div className='w-full'>
                    <Navigation />
                    <div className='px-8'>
                    <Outlet />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home