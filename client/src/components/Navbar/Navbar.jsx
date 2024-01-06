
import { Link } from 'react-router-dom'
import './Navbar.scss'
import React from 'react'

export default function Navbar() {
  return (
    <div className='outer'>
        <div className='logo'>Logo</div>   
        <div className='navbar'>
        <p>Purchasing Department</p>
        <Link to='manufacture'><p>Manufacturing Department</p></Link>
        <Link to='inventory'><p>Inventory Department</p></Link>
        <p>Sales Department</p>
        
    </div>
    </div>

  )
}
