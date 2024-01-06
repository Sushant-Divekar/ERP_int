import React, { useEffect, useState } from 'react';
import './Manufacturing.scss';

function Manufacturing() {
  const [orders, setOrders] = useState([]);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [error, setError] = useState(null);

  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const[manOrder , setmanOrder] = useState([]);
  const [showManOrder, setshowManOrder] = useState(false);

  const [selectedManOrder, setSelectedManOrder] = useState(null);
  const [editFormVisible, setEditFormVisible] = useState(false);
  // const [selectedEditOrder, setSelectedEditOrder] = useState(null);
  

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

  const editManOrder = async (e) => {
    try {
      e.preventDefault();
  
      // Collect form data using a regular JavaScript object
      const formData = {
        orderNumber: e.target.elements.orderNumber.value,
        resourcesRequired: e.target.elements.resourcesRequired.value,
        expectedCompletionDate: e.target.elements.expectedCompletionDate.value,
        workingStatus: e.target.elements.workingStatus.value,
        productionNotes: e.target.elements.productionNotes.value,
        qualityControlInformation: e.target.elements.qualityControlInformation.value,
      };
  
      const response = await fetch(`http://localhost:5000/manufacture/${formData.orderNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      console.log('Response:', response);
  
      if (response.ok) {
        console.log('Order edit successfully:', formData);
  
        // Update state with the edited data
        const updatedManOrder = manOrder.map((order) =>
          order.orderNumber === formData.orderNumber ? { ...order, ...formData } : order
        );
  
        setmanOrder(updatedManOrder);
      } else {
        console.error('Failed to edit order:', response.statusText);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  
    setEditFormVisible(false);
    setSelectedManOrder(null);
    setshowManOrder(true);
  };
  
  

  //get method
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
    setshowManOrder(false); // Close create form when toggling
    setCreateFormVisible(false);
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

  const handleEditButtonClick = async (editorder) => {
    setSelectedManOrder(editorder);
    setEditFormVisible(true);
    setshowManOrder(false); // Close order table when opening create form

  };

  const handleManOrder = async()=>{
    setshowManOrder(!showManOrder);
    setShowOrderStatus(false);
    setCreateFormVisible(false);
    setEditFormVisible(false);
    
  }

  const handleCloseEditForm = async() => {
    setEditFormVisible(false);
    setSelectedManOrder(null);
    setshowManOrder(true);

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
        {(
          <p className='order-info' onClick={toggle}>
            Show Orders From Purchasing Department
          </p>
        )}
        { (
          <p className='show-order' onClick={handleManOrder}>
            Show Manufacturing Order
          </p>
        )}
        {(
          <p className='graphical-view'>Graphical View Of Data</p>
        )}
      </div>

      {showOrderStatus && !showManOrder &&(
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

      {!showOrderStatus && showManOrder&&(
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
            <select
              type='text'
              id='workingStatus'
              name='workingStatus'
              placeholder='Enter working status'
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

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

      {editFormVisible && selectedManOrder &&(
        <div className='create-form'>
          <h2>Edit Manufacture Order</h2>
          <form onSubmit={(e) => { e.preventDefault(); editManOrder(e); }}>
            <label htmlFor='orderNumber'>orderNumber:</label>
            <input 
              type='text'
              id = 'orderNumber'
              name= 'orderNumber'
              value={selectedManOrder.orderNumber}
              readOnly/>
            <label htmlFor='productName'>Product Name:</label>
            <input
              type='text'
              id='productName'
              name='productName'
              value={selectedManOrder.productName}
              placeholder='Enter product name'
              readOnly/>
      
            <label htmlFor='resourcesRequired'>Resources Required:</label>
            <input
              type='text'
              id='resourcesRequired'
              name='resourcesRequired'
              placeholder='Enter resources required'
              defaultValue={selectedManOrder.resourcesRequired}
              // You can use defaultValue to set the default value
            />

            <label htmlFor='expectedCompletionDate'>Expected Completion Date:</label>
            <input
              type='date'
              id='expectedCompletionDate'
              name='expectedCompletionDate'
              defaultValue={selectedManOrder.expectedCompletionDate}
            />

            <label htmlFor='workingStatus'>Working Status:</label>
            {/* <input
              type='text'
              id='workingStatus'
              name='workingStatus'
              placeholder='Enter working status'
              defaultValue={selectedManOrder.workingStatus}
            /> */}
            <select
              type='text'
              id='workingStatus'
              name='workingStatus'
              placeholder='Enter working status'
              defaultValue={selectedManOrder.workingStatus}
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <label htmlFor='productionNotes'>Production Notes:</label>
            <textarea
              id='productionNotes'
              name='productionNotes'
              placeholder='Enter production notes'
              defaultValue={selectedManOrder.productionNotes}
            ></textarea>

            <label htmlFor='qualityControlInformation'>Quality Control Information:</label>
            <textarea
              id='qualityControlInformation'
              name='qualityControlInformation'
              placeholder='Enter quality control information'
              defaultValue={selectedManOrder.qualityControlInformation}
            ></textarea>

            <button type='submit'>Edit Order</button>
            <button type='button' onClick={handleCloseEditForm}>Cancel</button>
              
          </form>
        </div>
      )

      }
    </div>
  );
}

export default Manufacturing;