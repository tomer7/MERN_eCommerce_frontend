import axios from 'axios'
import React, { useEffect, useState } from 'react'
import store from '../store'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

const ProfileOptionsScreen = () => {
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
      }
   }, [])

   return (
      <div style={{ textAlign: 'center' }}>
         <Link to='/profile-details' className='btn btn-light my-3'>
            Edit My Profile Details
         </Link>
         <br />
         <Link to='/profile-orders' className='btn btn-light my-3'>
            Watch Profile Orders
         </Link>
      </div>
   )
}

export default ProfileOptionsScreen
