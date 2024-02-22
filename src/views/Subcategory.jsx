import React, { useEffect, useState } from 'react';
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import Drawer from '../components/Drawer';
import supabase from '../lib/helper';
import Loader from '../components/Loader';
import { stopLoading, startLoading } from '../store/slices/loaderSlice';
import { setSubForm, resetSubForm } from "../store/slices/subcategory";
import Table from '../components/Table';
import TextInput from "./../components/TextInput"
import SelectInput from "./../components/SelectInput"
const SubCategory = () => {
    const [fetchedCategories, setFetchedCategories] = useState([])
    const [fetchedSubcategories, setFetchedSubcategories] = useState([])
    const [avatarFile, setAvatarFile] = useState(null);
    const [ImageUrlShow, setImageUrlShow] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const isLoading = useSelector((state) => state.loader.isLoading);
    const subFormData = useSelector((state) => state.subcategory.subForm)
    const dispatch = useDispatch();

    const onFormChange = (e) => {
        const { name, value } = e.target;
        dispatch(setSubForm({ ...subFormData, [name]: value }))
    };
    const fetchSubCategories = async () => {
        try {
            dispatch(startLoading());
            let { data: subcategory, error } = await supabase.from('subcategory').select('*');
            if (error) {
                throw Error(error);
            } else {
                setFetchedSubcategories(subcategory);
                dispatch(stopLoading());
            }
            dispatch(stopLoading());
        } catch (error) {
            console.log(error);
            dispatch(stopLoading());
        }
    };
    const fetchCategories = async () => {
        try {
            let { data: category, error } = await supabase.from('category').select('*');
            if (error) {
                throw Error(error);
            } else {
                setFetchedCategories(category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteSubCategory = async (id) => {
        try {
            const { error } = await supabase.from('subcategory').delete().eq('id', id);
            if (error) {
                throw Error(error);
            } else {
                fetchSubCategories()
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateCategory = (item) => {
        dispatch(setSubForm({
            ...subFormData,
            subCatId: item.id,
            category_id: item.category_id,
            subCatName: item.name,
            description: item.description,
            updateButton: true,
            drawerId: item.id
        }))
    };

    const upoadImage = async (event) => {
        try {
            const uploadedFile = event.target.files[0];
            setAvatarFile(uploadedFile);
            const { data } = supabase.storage.from('avatars').getPublicUrl(uploadedFile.name)
            setImageUrlShow(data.publicUrl)
        } catch (error) {
            console.error('Image upload error:', error.message);
        }
    };


    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            try {
                let imageUrl = "";
                // Check if there's an avatar file to upload
                if (avatarFile) {
                    // Upload the avatar file
                    const { data: imageData, error: imageError } = await supabase.storage.from('avatars').upload('/' + avatarFile.name, avatarFile, {
                        cacheControl: '3600',
                        upsert: true
                    });

                    if (imageError) {
                        throw new Error(imageError.message);
                    }

                    // Get the path of the uploaded image
                    imageUrl = imageData.path;
                }

                // Construct the category data
                const { category_id, subCatName, description, updateButton, subCatId } = subFormData;
                const categoryData = { category_id: category_id, name: subCatName, description: description };
                if (imageUrl) {
                    categoryData.image = imageUrl;
                }
                console.log(categoryData.image)
                // Perform category update or insertion
                if (updateButton) {
                    const { data: catupdate, error: categoryError } = await supabase.from('subcategory').update(categoryData).eq('id', subCatId).select();
                    if (categoryError) {
                        throw new Error(categoryError);
                    }
                } else {
                    const { data: subcategory, error: error } = await supabase.from('subcategory').insert([categoryData]).select();
                    if (error) {
                        throw new Error(error);
                    }
                }
                dispatch(resetSubForm())
                fetchSubCategories()
            } catch (error) {
                console.log("Error updating category or image:", error);
            }
        }
    };


    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!subFormData.subCatName.trim()) {
            errors.catName = "Name is required";
            isValid = false;
        } else {
            isValid = true;
            errors.catName = "";
        }
        if (!subFormData.description.trim()) {
            errors.description = "Description is required";
            isValid = false;
        } else {
            isValid = true;
            errors.description = "";
        }
        setFormErrors(errors);
        return isValid;
    };
    useEffect(() => {
        validateForm();
        fetchCategories();
        fetchSubCategories()
    }, []);
    console.log(subFormData)
    return (
        <div>
            <Loader isLoading={isLoading} />
            <div className='flex justify-between'>
                <h4>Category List</h4>
                <label htmlFor={subFormData.drawerId} className="drawer-button btn btn-primary">Add</label>
            </div>
            <Drawer id={subFormData.drawerId}>
                <form onSubmit={handleSubmitForm}>
                    <SelectInput 
                    value={subFormData.category_id} 
                    name='category_id'
                    listOption={fetchedCategories}
                    onChange={onFormChange}
                    />
                    <TextInput
                        type="text"
                        name="subCatName"
                        value={subFormData.subCatName} 
                        onChange={onFormChange}
                        placeholder=""
                     />
                    <p>{formErrors.catName}</p>
                    <TextInput
                        type="text"
                        name="description"
                        value={subFormData.description} 
                        onChange={onFormChange}
                        placeholder=""
                     />
                     <TextInput
                        type="file"
                        name="image"
                        value={subFormData.image} 
                        onChange={upoadImage}
                        placeholder=""
                     />
                    <button type="submit" className="btn btn-primary">{!subFormData.updateButton ? "Submit" : "Update"}</button>
                    <img tittle="images" src={ImageUrlShow} alt='name' />
                </form>
            </Drawer>
            <Table data={fetchedSubcategories} drawerId={subFormData.drawerId} updateCategory={(e) => updateCategory(e)} deleteCategory={(id) => deleteSubCategory(id)} />
        </div>
    );
};

export default SubCategory;
