


import React, { useEffect, useState } from 'react';
import './Manufacturing.scss';
import { useParams } from 'react-router-dom';

function Manufacturing() {
  const [orders, setOrders] = useState([]);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [error, setError] = useState(null);

  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const[manOrder , setmanOrder] = useState([]);
  // const [showManOrder, setshowManOrder] = useState(false);

  const [showManOrderStatus, setShowManOrderStatus] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);

  // const { orderNumber } = useParams();

  // const [originalData, setOriginalData] = useState({
  //   orderNumber: '',
  //   productName: '',
  //   resourcesRequired: '',
  //   expectedCompletionDate: '',
  //   workingStatus: '',
  //   productionNotes: '',
  //   qualityControlInformation: '',
  // });

  // const [formData, setFormData] = useState({
  //   resourcesRequired: '',
  //   expectedCompletionDate: '',
  //   workingStatus: '',
  //   productionNotes: '',
  //   qualityControlInformation: '',
  // });

  // const getManufacturingDocumentByOrderNumber = async (orderNumber) => {
  //   const url = `/manufacture/${orderNumber}`;
  
  //   try {
  //     const response = await fetch(url);
  
  //     if (!response.ok) {
  //       throw new Error(`Error fetching manufacturing document: ${response.status} ${response.statusText}`);
  //     }
  
  //     const data = await response.json();
  //     return data; // Return the manufacturing document
  //   } catch (error) {
  //     console.error('Error fetching manufacturing document:', error.message);
  //     throw error; // Handle error as needed
  //   }
  // };

  // useEffect(() => {
  //   // Fetch the original data when the component mounts
  //   getManufacturingDocumentByOrderNumber(orderNumber)
  //     .then((data) => {
  //       setOriginalData(data);
  //       setFormData(data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching manufacturing document:', error.message);
  //       // Handle error as needed
  //     });
  // }, [orderNumber]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  // const submitForm = async () => {
  //   try {
  //     const response = await fetch(`/manufacture/${orderNumber}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error updating manufacturing document: ${response.status} ${response.statusText}`);
  //     }

  //     const updatedDocument = await response.json();
  //     console.log('Manufacturing document updated successfully:', updatedDocument);
  //     // Handle success as needed
  //   } catch (error) {
  //     console.error('Failed to update manufacturing document:', error.message);
  //     // Handle error as needed
  //   }
  // };

  
  useEffect(() => {
    // Fetch order data from your API endpoint
    fetch('http://localhost:5000/order')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setOrders(data);
        setError(null); // Reset error if the request is successful
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders. Please try again later.');
      });

  }, []);


  const handleCreateOrder = async (formData) => {

    try{
      // Fetch orderNumber and productName from the orderReceived collection
      const orderReceivedResponse = await fetch('http://localhost:5000/order');
      const orderReceivedData = await orderReceivedResponse.json();
      
      if (orderReceivedData.length > 0) {
        const orderNumber = selectedOrder._id.toString();
        console.log('Order Number:', orderNumber); 
        const productName = orderReceivedData[0].productName;
        console.log('Product Name:', productName);
        const resourcesRequired = calculateResourcesRequired(selectedOrder.quantity, productName);

        const dataToSend = {
          orderNumber,
          productName,
          resourcesRequired,
          expectedCompletionDate: formData.expectedCompletionDate.value,
          workingStatus: formData.workingStatus.value,
          productionNotes: formData.productionNotes.value,
          qualityControlInformation: formData.qualityControlInformation.value,
        };
        console.log('Data to send:', dataToSend);


      const response = await fetch('http://localhost:5000/manufacture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        console.log('Order created successfully:', dataToSend);
      } else {
        console.error('Failed to create order:', response.statusText);
      }
    }

    }catch(error){
      console.log(`the error is ${error}`);
    }
    // Implement logic to create a new order with the provided form data
    console.log('Creating order with data:', formData);

    // Reset the form visibility and selected order
    setCreateFormVisible(false);
    setSelectedOrder(null);
    setShowOrderStatus(true); // Show order table after creating order
  };

  
  
  useEffect(() =>{
    // Fetch order data from your API endpoint
    fetch('http://localhost:5000/manufacture')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setmanOrder(data);
        setError(null); // Reset error if the request is successful
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders. Please try again later.');
      });
  })


  const toggle = async() => {
    setShowOrderStatus(!showOrderStatus);
    setCreateFormVisible(false);
    setShowManOrderStatus(false); // Close create form when toggling
  };


  const handleCloseCreateForm = async() => {
    setCreateFormVisible(false);
    setSelectedOrder(null);
    setShowOrderStatus(true);

  };

  const handleCreateButtonClick = async (order) => {
    setSelectedOrder(order);
    setCreateFormVisible(true);
    setShowOrderStatus(false); // Close order table when opening create form
    setEditFormVisible(false);

  };

  const handleEditButtonClick = async () => {
   
    setEditFormVisible(true);
    setShowManOrderStatus(false); // Close order table when opening create form

  };

  const handleManOrder = async()=>{
    setShowManOrderStatus(!showManOrderStatus);
    setShowOrderStatus(false);
    
  }

  const handleCloseEditForm = async() => {
    setEditFormVisible(false);
    
    setShowManOrderStatus(true);

  };

  const calculateResourcesRequired = (quantity, productName) => {
    const resourcesPerUnit = 5; // Example: 5 resources per unit

    // Ensure quantity is a number
    const parsedQuantity = parseInt(quantity, 10);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      throw new Error('Invalid quantity');
    }

    return `${parsedQuantity * resourcesPerUnit} ${productName} Resources`;
  };





  return (
    <div>
      <div className='manufacture'>
        {!createFormVisible && (
          <p className='order-info' onClick={toggle}>
            Show Orders From Purchasing Department
          </p>
        )}
        {!createFormVisible && (
          <p className='show-order' onClick={handleManOrder}>
            Show Manufacturing Order
          </p>
        )}
        {!createFormVisible && (
          <p className='graphical-view'>Graphical View Of Data</p>
        )}
      </div>

      {showOrderStatus && !showManOrderStatus &&(
        <div className='orderTable'>
          <h2>Order Table</h2>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
                <th>Delivery Address</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.deliveryDate}</td>
                  <td>{order.deliveryAddress}</td>
                  <td>{order.paymentStatus}</td>
                  <td>
                    <button onClick={() => handleCreateButtonClick(order)}>
                      Create
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!showOrderStatus && showManOrderStatus&&(
        <div className='orderTable'>
          <h2>Manufacturing Order Table</h2>
          <table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Product Name</th>
                <th>Resource Required</th>
                <th>Expected Completion Date</th>
                <th>Working Status</th>
                <th>Production Notes</th>
                <th>Quality Control Information</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {manOrder.map(manorder => (
                <tr key={manorder._id}>
                  <td>{manorder.orderNumber}</td>
                  <td>{manorder.productName}</td>
                  <td>{manorder.resourcesRequired}</td>
                  <td>{manorder.expectedCompletionDate}</td>
                  <td>{manorder.workingStatus}</td>
                  <td>{manorder.productionNotes}</td>
                  <td>{manorder.qualityControlInformation}</td>
                  <td>
                    <button onClick={() => handleEditButtonClick(manorder)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {createFormVisible && selectedOrder && (
        <div className='create-form'>
          <h2>Create Order</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleCreateOrder(e.target); }}>
            <label htmlFor='orderNumber'>Order Number:</label>
            <input
              type='text'
              id='orderNumber'
              name='orderNumber'
              value={selectedOrder.orderNumber}
              // placeholder={orderNumber}
              placeholder={selectedOrder.orderNumber}
              readOnly
              
            />

            <label htmlFor='productName'>Product Name:</label>
            <input
              type='text'
              id='productName'
              name='productName'
              value={selectedOrder.productName}
              placeholder='Enter product name'
              readOnly
            />

            {/* <label htmlFor='resourcesRequired'>Resources Required:</label>
            <input
              type='text'
              id='resourcesRequired'
              name='resourcesRequired'
              placeholder='Enter resources required'
              required
            /> */}

            <label htmlFor='expectedCompletionDate'>Expected Completion Date:</label>
            <input
              type='date'
              id='expectedCompletionDate'
              name='expectedCompletionDate'
              required
            />
            <label htmlFor='workingStatus'>Working Status:</label>
            <input
              type='text'
              id='workingStatus'
              name='workingStatus'
              placeholder='Enter working status'
              required
            />

            <label htmlFor='productionNotes'>Production Notes:</label>
            <textarea
              id='productionNotes'
              name='productionNotes'
              placeholder='Enter production notes'
              required
            ></textarea>

            <label htmlFor='qualityControlInformation'>Quality Control Information:</label>
            <textarea
              id='qualityControlInformation'
              name='qualityControlInformation'
              placeholder='Enter quality control information'
              required
            ></textarea>

            {/* Include other fields as needed */}
            
            <button type='submit'>Create Order</button>
            <button type='button' onClick={handleCloseCreateForm}>Cancel</button>
          </form>
        </div>
      )}

      { showManOrderStatus && editFormVisible&&(
      <div className='create-form'>
      <h2>Edit Manufacturing Document</h2>
      <form>
        <label htmlFor="orderNumber">Order Number:</label>
        <input
          type="text"
          id="orderNumber"
          name="orderNumber"
          value={originalData.orderNumber}
          readOnly
        />

        <label htmlFor="productName">Product Name:</label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={originalData.productName}
          readOnly
        />

        <label htmlFor="resourcesRequired">Resources Required:</label>
        <input
          type="text"
          id="resourcesRequired"
          name="resourcesRequired"
          value={formData.resourcesRequired || originalData.resourcesRequired}
          onChange={handleInputChange}
        />

        <label htmlFor="expectedCompletionDate">Expected Completion Date:</label>
        <input
          type="date"
          id="expectedCompletionDate"
          name="expectedCompletionDate"
          value={formData.expectedCompletionDate || originalData.expectedCompletionDate}
          onChange={handleInputChange}
        />

        <label htmlFor="workingStatus">Working Status:</label>
        <select
          id="workingStatus"
          name="workingStatus"
          value={formData.workingStatus || originalData.workingStatus}
          onChange={handleInputChange}
        >
          <option value="In progress">In progress</option>
          <option value="Completed">Completed</option>
          {/* Add more options as needed */}
        </select>

        <label htmlFor="productionNotes">Production Notes:</label>
        <textarea
          id="productionNotes"
          name="productionNotes"
          value={formData.productionNotes || originalData.productionNotes}
          onChange={handleInputChange}
        />

        <label htmlFor="qualityControlInformation">Quality Control Information:</label>
        <input
          type="text"
          id="qualityControlInformation"
          name="qualityControlInformation"
          value={formData.qualityControlInformation || originalData.qualityControlInformation}
          onChange={handleInputChange}
        />

        <button type="button" onClick={submitForm}>
        <button type='button' onClick={handleCloseEditForm}>Cancel</button>
          Submit
        </button>
      </form>
    </div>
    )}

      

    </div>
  );
}

export default Manufacturing;

// const handleInputAddNewProduct = (e) => {
//   const newValue = e.target.value;
//   setAddNewProduct((prevData) => ({
//     ...prevData,
//     productName: newValue,
//   }));
// };


{visibleAddNewProduct &&(
  <div className='create-form'>
  <h2>Edit Inventory</h2>
  <form onSubmit={(e) => { e.preventDefault(); PostData(e); }}>


      <label htmlFor='productName'>Product Name:</label>
      <input
      type='text'
      id='productName'
      name='productName'
      required
      onChange = {(e) => setAddNewProduct({...addNewProduct , productName : e.target.value})}
      
      // placeholder='Enter product name'
      />

      <label htmlFor='availableStocks'>Available Stocks:</label>
      <input
      type='text'
      id='availableStocks'
      name='availableStocks'
      required
      onChange = {(e) => setAddNewProduct({...addNewProduct , availableStocks: e.target.value})}
      
      // placeholder='Enter resources required'
      />

      <label htmlFor='currentStocks'>Current Stocks:</label>
      <input
      type='number'
      id='currentStocks'
      name='currentStocks'
      required
      onChange = {(e) => setAddNewProduct({...addNewProduct , currentStocks: e.target.value})}
      
      
      />
      <label htmlFor='unitPrice'>Unit Price:</label>
      <input
      type='number'
      id='unitPrice'
      name='unitPrice'
      required
      onChange = {(e) => setAddNewProduct({...addNewProduct , unitPrice: e.target.value})}
      
      // placeholder='Enter working status'
      
      />

      <label htmlFor='stockLocation'>Stock Location:</label>
      <input
      type='text'
      id='stockLocation'
      name='stockLocation'
      required
      onChange = {(e) => setAddNewProduct({...addNewProduct , stockLocation: e.target.value})}
      
      // placeholder='Enter production notes'
      
      ></input>

      <label htmlFor='stockStatus'>Stock Status:</label>
      <input
      type='text'
      id='stockStatus'
      name='stockStatus'
      required
      onChange = {(e) => setAddNewProduct({...addNewProduct , stockStatus: e.target.value})}
      
      // placeholder='Enter quality control information'
      
      ></input>

      {/* Include other fields as needed */}
      
      <button type='submit'>Edit </button>
      <button type='button' onClick={handleCloseAddNewProductForm}>Cancel</button>
  </form>
  </div>
)}