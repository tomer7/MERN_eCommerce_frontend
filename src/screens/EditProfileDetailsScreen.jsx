import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import store from '../store'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import { loginUser } from './functions'

const EditProfileDetailsScreen = () => {
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   const navigate = useNavigate()
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [message, setMessage] = useState(null)

   const fetchMyDetails = async () => {
      const config = {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      const value = await axios.get(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/users/profile-edit`,
         config
      )
      if (value.message) {
         setMessage(value.response.data.message)
      } else {
         setName(value.data.name)
         setEmail(value.data.email)
      }
   }

   const updateMyProfileDetails = async () => {
      const config = {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }
      let value = null
      if (password == '') {
         value = await axios.put(
            `${process.env.REACT_APP_BACK_ADDRESS}/api/users/profile-edit`,
            { name, email },
            config
         )
      } else {
         value = await axios.put(
            `${process.env.REACT_APP_BACK_ADDRESS}/api/users/profile-edit`,
            { name, email, password },
            config
         )
      }

      if (value.message) {
         setMessage(value.response.data.message)
      } else {
         setMessage('User Update Successfully!')
      }
   }

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
      }

      fetchMyDetails()
   }, [])

   const submitHandler = (event) => {
      event.preventDefault()
      if (password !== confirmPassword) {
         setMessage('Passwords do not match')
      } else {
         updateMyProfileDetails()
      }
   }

   return (
      <>
         <Link to='/profile-options' className='btn btn-light my-3'>
            Go Back
         </Link>
         <Row style={{ textAlign: 'center' }}>
            <h2>User Profile</h2>
            {message && <Message>{message}</Message>}
            {/* {success && (
                  <Message variant='success'>Profile Updated!</Message>
               )} */}
            <Form onSubmit={submitHandler}>
               <Form.Group controlId='name' style={{ 'margin-bottom': '20px' }}>
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                     className='text-center inputDesign'
                     type='name'
                     placeholder='Enter name'
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
               </Form.Group>
               <Form.Group
                  controlId='email'
                  style={{ 'margin-bottom': '20px' }}
               >
                  <Form.Label>Email Address:</Form.Label>
                  <Form.Control
                     className='text-center inputDesign'
                     type='email'
                     placeholder='Enter email'
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
               </Form.Group>

               <Form.Group
                  controlId='password'
                  style={{ 'margin-bottom': '20px' }}
               >
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                     className='text-center inputDesign'
                     type='password'
                     placeholder='Enter password'
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
               </Form.Group>
               <Form.Group
                  controlId='confirmPassword'
                  style={{ 'margin-bottom': '20px' }}
               >
                  <Form.Label>Confirm Password:</Form.Label>
                  <Form.Control
                     className='text-center inputDesign'
                     type='password'
                     placeholder='Confirm password'
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                  ></Form.Control>
               </Form.Group>

               <Button type='submit' variant='primary'>
                  Update
               </Button>
            </Form>
         </Row>
      </>
   )
}

export default EditProfileDetailsScreen
