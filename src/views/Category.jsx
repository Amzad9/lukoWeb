import React, { useEffect, useState } from 'react';
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import Drawer from '../components/Drawer';
import supabase from '../lib/helper';
import Loader from '../components/Loader';
import { stopLoading, startLoading } from '../store/slices/loaderSlice';
import { setCatForm, resetcatForm } from '../store/slices/category';
import Table from './../components/Table';
import TextInput from "./../components/TextInput"
import SelectInput from "./../components/SelectInput"
const Category = () => {
    const [fetchcategory, setFetchCategory] = useState([])
    const [avatarFile, setAvatarFile] = useState(null);
    const [ImageUrlShow, setImageUrlShow] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const isLoading = useSelector((state) => state.loader.isLoading);
    const catFormData = useSelector((state) => state.category.catForm);

    console.log(isLoading)
    const dispatch = useDispatch();

    const onFormChange = (e) => {
        const { name, value } = e.target;
        dispatch(setCatForm({ ...catFormData, [name]: value }))
    };

    const fetchCategories = async () => {
        try {
            dispatch(startLoading());
            let { data: category, error } = await supabase
            .from('category')
            .select('*');
            dispatch(stopLoading());

            if (error) {
                throw Error(error);
            } else {
                setFetchCategory(category);
            }
        } catch (error) {
            console.log(error);
            dispatch(stopLoading());
        }
    };

    const deleteCategory = async (id) => {
        if(confirm("Are you sure to delete category?")){
            try {
                const { error } = await supabase.from('category').delete().eq('id', id);
                if (error) {
                    throw Error(error);
                } else {
                    fetchCategories();
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const updateCategory = (item) => {
        dispatch(setCatForm({
            ...catFormData,
            catId: item.id,
            catName: item.name,
            description: item.description,
            updateButton: true,
            drawerId: item.id
        }))
    };

    const upoadImage = async (event) => {
        try {
            const uploadedFile = event.target.files[0];
          
            setAvatarFile(uploadedFile);
            const { data } = supabase
                .storage
                .from('avatars')
                .getPublicUrl(uploadedFile.name)
                setImageUrlShow(data.publicUrl)
                console.log({data})
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
                    const { data: imageData, error: imageError } = await supabase
                        .storage
                        .from('avatars')
                        .upload('/' + avatarFile.name, avatarFile, {
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
                const { catName, description, updateButton, catId } = catFormData;
                const categoryData = { name: catName, description: description };
                if (imageUrl) {
                    categoryData.image = imageUrl;
                }
                dispatch(resetcatForm())
                // Perform category update or insertion
                if(updateButton){
                    const { data: catupdate, error: categoryError } = await  supabase.from('category').update(categoryData).eq('id', catId).select();
                    if (categoryError) {
                        throw new Error(categoryError);
                    }
                dispatch(resetcatForm())
                }else{
                    const { data: categoryadd, error: categoryError } = await supabase.from('category').insert([categoryData]).select();
                    if (categoryError) {
                        throw new Error(categoryError);
                    }
                  dispatch(resetcatForm())
                }
                fetchCategories();
            } catch (error) {
                console.log("Error updating category or image:", error);
            }
        }
    };
    

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!catFormData.catName.trim()) {
            errors.catName = "Name is required";
            isValid = false;
        }
        if (!catFormData.description.trim()) {
            errors.description = "Description is required";
            isValid = false;
        }
        setFormErrors(errors);
        return isValid;
    };
    useEffect(() => {
        validateForm();
        fetchCategories();
    }, []);
    return (
        <div>
            <Loader isLoading={isLoading} />
            <div className='flex justify-between'>
                <h4>Category List</h4>
                <label htmlFor={catFormData.drawerId} className="drawer-button btn btn-primary">Add</label>
            </div>
            <Drawer id={catFormData.drawerId}>
                <form onSubmit={handleSubmitForm}>
                <TextInput
                        type="text"
                        name="catName"
                        value={catFormData.catName} 
                        onChange={onFormChange}
                        placeholder="Category Name"
                     />
                    <p>{formErrors.catName}</p>
                    <TextInput
                        type="text"
                        name="description"
                        value={catFormData.description} 
                        onChange={onFormChange}
                        placeholder="Description"
                     />
                     <TextInput
                        type="file"
                        name="image"
                        value={catFormData.image} 
                        onChange={upoadImage}
                        placeholder=""
                     />
                    {/* <input type="text" name='catName' value={catFormData.catName} onChange={onFormChange} placeholder="Name" className="input input-bordered w-full max-w-xs" />
                    <p>{formErrors.catName}</p>
                    <input type="text" name='description' value={catFormData.description} onChange={onFormChange} placeholder="Description" className="input input-bordered w-full max-w-xs" />
                    <p>{formErrors.description}</p>
                    <input type="file" name='image' value={catFormData.image} onChange={upoadImage} className="file-input file-input-bordered file-input-error w-full max-w-xs" /> */}
                    <button type="submit" className="btn btn-primary">{!catFormData.updateButton ? "Submit" : "Update"}</button>
                    <img tittle="images" src={ImageUrlShow} alt='name' />
                </form>
            </Drawer>
            <Table data={fetchcategory} drawerId={catFormData.drawerId} updateCategory={(e) => updateCategory(e)} deleteCategory={(id) => deleteCategory(id)} />
        </div>
    );
};

export default Category;
