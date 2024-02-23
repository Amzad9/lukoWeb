import React ,{useState}from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IoIosRefresh } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
const paginatorLeft = <button type="button" className='btn'><IoIosRefresh /></button>;
const paginatorRight = <span type="button" icon="pi pi-download" />;
function table({data, updateCategory, deleteCategory, drawerId, isProduct= false}) {
    console.log({isProduct})
    const actionBodyTemplate = (item) => {
        return (
            <div className="flex align-items-center gap-2">
                <button className='btn btn-sm btn-info'><FaRegEye /></button>
                <label htmlFor={drawerId} onClick={() => updateCategory(item)} className='btn btn-sm brn btn-success'><FaRegEdit /></label>
                <button onClick={() => deleteCategory(item.id)} className='btn btn-sm btn-error'><MdOutlineDelete /></button>
            </div>
        );
    };
    const imageBodyTemplate = (item) => {
        return <img src={`https://xgdjlvyjrfuwdhvueogk.supabase.co/storage/v1/object/public/avatars/${item.image}`} alt={item.image} width="24px" className="shadow-4" />;
    };
  return (
    <DataTable value={data} stripedRows showGridlines globalFilterFields={['name']} size='small' sortMode="multiple" rowsPerPageOptions={[5, 10, 25, 50]} paginator rows={5}  tableStyle={{ minWidth: '50rem' }}
        paginatorTemplate=" FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
        <Column field="image" header="Image" body={imageBodyTemplate} style={{ width: '10%' }}></Column>
        <Column field="name" header="Name" sortable style={{ width: '25%' }}></Column>
        <Column field="description" header="Description" style={{ width: '40%' }}></Column>
        {isProduct && (<Column field="brand" header="brand" sortable style={{ width: '25%' }}></Column> )}
        {isProduct && (<Column field="price" header="price" sortable style={{ width: '25%' }}></Column> )}

        {isProduct && (<Column field="image_url" header="image_url" sortable style={{ width: '25%' }}></Column>)}
        {isProduct && (<Column field="stock_quantity" header="stock_quantity" sortable style={{ width: '25%' }}></Column>)}
        <Column field="" header="Action" body={actionBodyTemplate} style={{ width: '25%' }}></Column>
    </DataTable>
  )
}

export default table

// 
// 
// 
// 