import React from 'react'

const Drawer = ({id, children}) => {
    return (
        <>
            <div className="drawer drawer-end z-50">
                <input id={id} type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    {/* <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">Open drawer</label> */}
                </div>
                <div className="drawer-side">
                    <label htmlFor={id} aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                        {children}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Drawer