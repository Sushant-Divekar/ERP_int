import React, { useState } from 'react';
import './Purchasing.scss';

export default function Purchasing() {
    function toggle() {
        setShowOrderStatus(!showOrderStatus);
    }

    const [showOrder, setShowOrder] = useState([1, 2, 3, 4]);
    const [showOrderStatus, setShowOrderStatus] = useState(false);

    return (
        <div>
            <div className='top'>
                <div className='b b1' onClick={toggle}>
                    <p>Show All Orders</p>
                </div>
                <div className='b b2'>Add new Order</div>
                <div className='b b3'>Show Graphically</div>
            </div>
            <div className='order'>
                {showOrderStatus &&
                    showOrder.map(orderItem => (
                        <div key={orderItem} className='order-item'>
                            {/* Render content for each order item */}
                            Order #{orderItem}
                        </div>
                    ))}
            </div>
        </div>
    );
}