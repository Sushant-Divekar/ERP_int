import React, { useEffect, useState } from 'react'
import './Inventory.scss'
import { useParams } from 'react-router-dom';

const Inventory = () => {

  const [inventory, setInventory] = useState([]);
  const [showInventory , setShowInventory] = useState(false);
  // const [editInventory , setEditinventory] = useState([]);
  const [visibleEditInventory , setVisibleEditInventory] = useState(false);
  const [selectInventory , setSelectInventory] = useState(null);

  const [visibleAddNewProduct , setVisibleAddNewProduct] = useState(false);
  
  

  
  
// Fetch Inventory;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/inventory');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setInventory(data);

      } catch (error) {
        console.error('Error fetching orders:', error);
        
      }
    };

    fetchData();
  }, []);


  //Add New Product

  const handleAddNewProductChange = (e) => {
    const { name, value } = e.target;
    setAddNewProduct((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [addNewProduct , setAddNewProduct] = useState({
    productName:"",
    availableStocks:"",
    currentStocks:"" ,
    unitPrice:"",
    stockLocation:"",
    stockStatus:""

  });

  

  const PostData = async (e) =>{
    e.preventDefault();

    const { productName ,
            availableStocks ,
            currentStocks ,
            unitPrice ,
            stockLocation ,
            stockStatus } = addNewProduct;

    const res = await fetch(`http://localhost:5000/inventory` ,{
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify({
          productName ,
          availableStocks ,
          currentStocks ,
          unitPrice ,
          stockLocation ,
          stockStatus
        })


    });

    const data = await res.json();

    if(data.status === 422 || !data){
        window.alert("Invalid");
        console.log("Invalid")
    }
    else{
        window.alert("valid");
        console.log("Valid")
        
    }

    setVisibleAddNewProduct(false);
    setShowInventory(true);
}
  



  //Edit Inventory
  const handleEditInventory = async(editForm) =>{

    try{

      const inventoryResponse = await fetch('http://localhost:5000/inventory');
      const inventoryData = await inventoryResponse.json();
      
      const ID = selectInventory._id.toString();
      console.log(`ID is ${ID}`);

        const dataToEdit = {
            productName:editForm.productName,
            availableStocks: editForm.availableStocks,
            currentStocks: editForm.currentStocks,
            unitPrice: editForm.unitPrice,
            stockLocation: editForm.stockLocation,
            stockStatus:editForm.stockStatus

            
          };

        const response = await fetch(`http://localhost:5000/inventory/${ID}` , {
            method : 'PUT',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToEdit)
        });

        if (response.ok) {
            // Update the state with the edited item
            setInventory((prevInventory) =>
              prevInventory.map((item) =>
                item._id === selectInventory._id ? { ...item, ...dataToEdit } : item
              )
            );

            
          } 
        else {
            
            console.error('Error updating data');
        }
    }catch(error){
        console.log("error:" , error)
    }

    setShowInventory(true);
    setVisibleEditInventory(false);
    setVisibleAddNewProduct(false);
  }

  const handleShowInventory = async()=>{
    setShowInventory(true)
    setVisibleEditInventory(false);
    setVisibleAddNewProduct(false);
  }
  
  const handleEditButtonInventory = async(selectedInventory)=>{
    setSelectInventory(selectedInventory);
    setShowInventory(false);
    setVisibleEditInventory(true)
    setVisibleAddNewProduct(false);
  }

  const handleCloseEditForm = async()=>{
    setShowInventory(true);
    setVisibleEditInventory(false)
  }

  const handleAddNewProduct = async()=> {
    setShowInventory(false);
    setVisibleAddNewProduct(true);
  }

  const handleCloseAddNewProductForm = async()=>{
    setShowInventory(true);
    setVisibleAddNewProduct(false);
  }


  return (
    <div>

        <div className='inventory'>
            
            <p className='inventory-info' onClick={handleShowInventory}>
                Show Inventory
            </p>

            <p className='add-new-product' onClick={handleAddNewProduct}>
                Add New Product
            </p>
            
            
            <p className='graphical-view'>
                Graphical View Of Data
            </p>
           
        </div>

        {showInventory&&(
            <div className='inventoryTable'>
            <h2>Inventory Table</h2>
            <table>
                <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Available Stocks</th>
                    <th>Current Stocks</th>
                    <th>Unit Price</th>
                    <th>Stock Location</th>
                    <th>Stock Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {inventory.map(inventories => (
                    <tr key={inventories._id}>
                    <td>{inventories.productName}</td>
                    <td>{inventories.availableStocks}</td>
                    <td>{inventories.currentStocks}</td>
                    <td>{inventories.unitPrice}</td>
                    <td>{inventories.stockLocation}</td>
                    <td>{inventories.stockStatus}</td>
                    <td>
                        <button onClick={() => handleEditButtonInventory(inventories)}>
                            Edit
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}

        {/* Edit Inventory Form */}
        {visibleEditInventory && selectInventory&&(
            <div className='create-form'>
            <h2>Edit Inventory</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEditInventory(selectInventory); }}>
        

                <label htmlFor='productName'>Product Name:</label>
                <input
                type='text'
                id='productName'
                name='productName'
                defaultValue={selectInventory.productName}
                // placeholder='Enter product name'
                readOnly
                />

                <label htmlFor='availableStocks'>Available Stocks:</label>
                <input
                type='text'
                id='availableStocks'
                name='availableStocks'
                defaultValue={selectInventory.availableStocks}
                onChange={(e) => setSelectInventory({ ...selectInventory, availableStocks: e.target.value })}
                // placeholder='Enter resources required'
                />

                <label htmlFor='currentStocks'>Current Stocks:</label>
                <input
                type='number'
                id='currentStocks'
                name='currentStocks'
                defaultValue={selectInventory.currentStocks}
                onChange={(e) => setSelectInventory({ ...selectInventory, currentStocks: e.target.value })}
                
                />
                <label htmlFor='unitPrice'>Unit Price:</label>
                <input
                type='number'
                id='unitPrice'
                name='unitPrice'
                defaultValue={selectInventory.unitPrice}
                onChange={(e) => setSelectInventory({ ...selectInventory, unitPrice: e.target.value })}
                // placeholder='Enter working status'
                
                />

                <label htmlFor='stockLocation'>Stock Location:</label>
                <input
                type='text'
                id='stockLocation'
                name='stockLocation'
                defaultValue={selectInventory.stockLocation}
                onChange={(e) => setSelectInventory({ ...selectInventory, stockLocation: e.target.value })}
                // placeholder='Enter production notes'
                
                ></input>

                <label htmlFor='stockStatus'>Stock Status:</label>
                <select
                type='text'
                id='stockStatus'
                name='stockStatus'
                defaultValue={selectInventory.stockStatus}
                onChange={(e) => setSelectInventory({ ...selectInventory, stockStatus: e.target.value })}
                // placeholder='Enter quality control information'
                
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>

                {/* Include other fields as needed */}
                
                <button type='submit'>Edit </button>
                <button type='button' onClick={handleCloseEditForm}>Cancel</button>
            </form>
            </div>
        )}

        {/* Add New Product Inventory Form */}
         {/* Add New Product Inventory Form */}
      {visibleAddNewProduct && (
        <div className='create-form'>
          <h2>Add New Product</h2>
          <form onSubmit={PostData}>
            <label htmlFor='productName'>Product Name:</label>
            <input
              type='text'
              id='productName'
              name='productName'
              required
              value={addNewProduct.productName}
              onChange={handleAddNewProductChange}
            />

            <label htmlFor='availableStocks'>Available Stocks:</label>
            <input
              type='text'
              id='availableStocks'
              name='availableStocks'
              required
              value={addNewProduct.availableStocks}
              onChange={handleAddNewProductChange}
            />

            <label htmlFor='currentStocks'>Current Stocks:</label>
            <input
              type='number'
              id='currentStocks'
              name='currentStocks'
              required
              value={addNewProduct.currentStocks}
              onChange={handleAddNewProductChange}
            />

            <label htmlFor='unitPrice'>Unit Price:</label>
            <input
              type='number'
              id='unitPrice'
              name='unitPrice'
              required
              value={addNewProduct.unitPrice}
              onChange={handleAddNewProductChange}
            />

            <label htmlFor='stockLocation'>Stock Location:</label>
            <input
              type='text'
              id='stockLocation'
              name='stockLocation'
              required
              value={addNewProduct.stockLocation}
              onChange={handleAddNewProductChange}
            />

            <label htmlFor='stockStatus'>Stock Status:</label>
            <select
              type='text'
              id='stockStatus'
              name='stockStatus'
              required
              value={addNewProduct.stockStatus}
              onChange={handleAddNewProductChange}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            <button type='submit'>Add Product</button>
            <button type='button' onClick={handleCloseAddNewProductForm}>
              Cancel
            </button>
          </form>
        </div>
      )}
      
    </div>
  )
}

export default Inventory
