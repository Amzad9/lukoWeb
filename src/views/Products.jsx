import React, { useEffect, useState, useMemo } from 'react';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import Drawer from '../components/Drawer';
import supabase from '../lib/helper';
import Loader from '../components/Loader';
import { stopLoading, startLoading } from '../store/slices/loaderSlice';
import { setProductForm, resetProductForm } from '../store/slices/product';
import Table from './../components/Table';
import TextInput from "./../components/TextInput"
import SelectInput from "./../components/SelectInput"
const Category = () => {
    const [fetchProduct, setFetchProduct] = useState([])
    const [fetchSubCategories, setFetchSubCategories] = useState([])
    const [fetchCategories, setFetchCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredSubcategory, setFilteredSubcategories] = useState()
    const [avatarFile, setAvatarFile] = useState(null);
    const [ImageUrlShow, setImageUrlShow] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const isLoading = useSelector((state) => state.loader.isLoading);
    const productFormData = useSelector((state) => state.product.productForm);

    console.log(isLoading)
    const dispatch = useDispatch();

    const onFormChange = (e) => {
        const { name, value } = e.target;
        dispatch(setProductForm({ ...productFormData, [name]: value }))
    };
    console.log({ productFormData })
    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value
        setSelectedCategory(selectedCategory);
        dispatch(setProductForm({ ...productFormData, category_id: selectedCategory }))
    };
    const fetchCategoriesData = async () => {
        try {
            let { data: category, error } = await supabase.from('category').select('*');
            if (error) {
                throw Error(error);
            } else {
                setFetchCategories(category);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const fetchSubCategoriesData = async () => {
        try {
            let { data: category, error } = await supabase.from('subcategory').select('*');
            if (error) {
                throw Error(error);
            } else {
                setFetchSubCategories(category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchProducts = async () => {
        try {
            dispatch(startLoading());
            let { data: product, error } = await supabase
                .from('product')
                .select('*');
            dispatch(stopLoading());

            if (error) {
                throw Error(error);
            } else {
                setFetchProduct(product);
            }
        } catch (error) {
            console.log(error);
            dispatch(stopLoading());
        }
    };

    const deleteCategory = async (id) => {
        if (confirm("Are you sure to delete category?")) {
            try {
                const { error } = await supabase.from('category').delete().eq('id', id);
                if (error) {
                    throw Error(error);
                } else {
                    fetchProducts();
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const updateCategory = (item) => {
        console.log({ item })
        dispatch(setProductForm({
            ...productFormData,
            product_id: item.product_id,
            name: item.name,
            category_id: item.category_id,
            subcategory_id: item.subcategory_id,
            brand: item.brand,
            price: item.price,
            description: item.description,
            image_url: item.image_url,
            stock_quantity: item.stock_quantity,
            updateButton: true,
            drawerId: item.name,
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
            console.log({ data })
        } catch (error) {
            console.error('Image upload error:', error.message);
        }
    };



    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
      if(isValid){
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
            const {
                product_id,
                name,
                category_id,
                subcategory_id,
                brand,
                price,
                description,
                stock_quantity,
                updateButton
            } = productFormData;
            console.log({ product_id })
            const proData = {
                name: name,
                category_id: category_id,
                subcategory_id: subcategory_id,
                brand: brand,
                price: price,
                description: description,
                stock_quantity: stock_quantity
            };
            if (imageUrl) {
                proData.image_url = imageUrl;
            }
            dispatch(resetProductForm())
            // Perform category update or insertion
            if (updateButton) {
                const { data: productUpdate, error: error } = await supabase.from('product').update(proData).eq('product_id', product_id).select();
                if (error) {
                    throw new Error(error);
                }
                dispatch(resetProductForm())
            } else {
                const { data, error } = await supabase.from('product').insert([proData]).select();
                console.log({ data })
                if (error) {
                    console.log(error)
                }
                dispatch(resetProductForm())
            }
            fetchProducts();
        } catch (error) {
            console.log("Error updating product or image:", error);
        }
     }
    };

    const validateField = (fieldName) => {
        let error = '';
    
        switch (fieldName) {
            case 'name':
                if (!productFormData.name.trim()) {
                    error = 'Name is required';
                }
                break;
            case 'description':
                if (!productFormData.description.trim()) {
                    error = 'Description is required';
                }
                break;
            case 'brand':
                if (!productFormData.brand.trim()) {
                    error = 'Brand is required';
                }
                break;
            case 'price':
                if (!productFormData.price.trim()) {
                    error = 'Price is required';
                }
                break;
            case 'stock_quantity':
                if (!productFormData.stock_quantity.trim()) {
                    error = 'Stock quantity is required';
                }
                break;
            case 'category_id':
                if (!productFormData.category_id.trim()) {
                    error = 'Category is required';
                }
                break;
            case 'subcategory_id':
                if (!productFormData.subcategory_id.trim()) {
                    error = 'Subcategory is required';
                }
                break;
            default:
                break;
        }
    
        return error;
    };
    
    const handleBlur = (fieldName) => {
        const error = validateField(fieldName);
        setFormErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
    };
    
    const handleFocus = (fieldName) => {
        setFormErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }));
    };
    
    const validateForm = () => {
        let isValid = true;
    
        ['name', 'description', 'brand', 'price', 'stock_quantity', 'category_id', 'subcategory_id'].forEach(fieldName => {
            const error = validateField(fieldName);
            if (error) {
                setFormErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
                isValid = false;
            }
        });
    
        return isValid;
    };
    
    useEffect(() => {
        if (selectedCategory !== '') {
            const filteredSubcategories = fetchSubCategories.filter(subcategory => subcategory.category_id === parseInt(selectedCategory));
            console.log('Filtered subcategories:', filteredSubcategories);
            setFilteredSubcategories(filteredSubcategories);
        } else {
            setFilteredSubcategories([]);
        }
    }, [selectedCategory, fetchSubCategories]);

    useEffect(() => {
        validateForm();
        fetchProducts();
        fetchCategoriesData()
        fetchSubCategoriesData()
    }, []);


    const memoizedCategories = useMemo(() => fetchCategories, [fetchCategories]);
    const memoizedFilteredSubcategories = useMemo(() => filteredSubcategory, [filteredSubcategory]);

    return (
        <div>
            <Loader isLoading={isLoading} />
            <div className='flex justify-between'>
                <h4>Category List</h4>
                <label htmlFor={productFormData.drawerId} className="drawer-button btn btn-primary">Add</label>
            </div>
            <Drawer id={productFormData.drawerId}>
                <form onSubmit={handleSubmitForm}>
                    <TextInput
                        type="text"
                        name="name"
                        value={productFormData.name}
                        onChange={onFormChange}
                        placeholder="Product Name"
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        inputError={formErrors.name}
                    />
                   
                    <TextInput
                        type="text"
                        name="description"
                        value={productFormData.description}
                        onChange={onFormChange}
                        placeholder="Description"
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        inputError={formErrors.description}
                    />
                    <SelectInput
                        value={selectedCategory}
                        name='category_id'
                        listOption={memoizedCategories}
                        onChange={handleCategoryChange}
                        inputError={formErrors.category_id}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                    />
                   
                    <SelectInput
                        value={productFormData.subcategory_id}
                        name='subcategory_id'
                        listOption={memoizedFilteredSubcategories}
                        onChange={onFormChange}
                        inputError={formErrors.subcategory_id}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                    />
                    <TextInput
                        type="text"
                        name="brand"
                        value={productFormData.brand}
                        onChange={onFormChange}
                        placeholder="Brand Name"
                        inputError={formErrors.brand}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                    />
                    <TextInput
                        type="number"
                        name="price"
                        value={productFormData.price}
                        onChange={onFormChange}
                        placeholder="Price"
                        inputError={formErrors.price}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                    />
                    <TextInput
                        type="number"
                        name="stock_quantity"
                        value={productFormData.stock_quantity}
                        onChange={onFormChange}
                        placeholder="Stock"
                        inputError={formErrors.stock_quantity}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                    />
                    <TextInput
                        type="file"
                        name="image"
                        value={productFormData.image}
                        onChange={upoadImage}
                        placeholder=""
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                    />
                    <button type="submit" className="btn btn-primary">{!productFormData.updateButton ? "Submit" : "Update"}</button>
                    <img tittle="images" src={ImageUrlShow} alt='name' />
                </form>
            </Drawer>
            <Table isProduct={true} data={fetchProduct} drawerId={productFormData.drawerId} updateCategory={(e) => updateCategory(e)} deleteCategory={(id) => deleteCategory(id)} />
        </div>
    );
};

export default Category;
