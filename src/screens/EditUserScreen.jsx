import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import { Form, Button } from 'react-bootstrap'
import store from '../store'
import axios from 'axios'
import Message from '../components/Message'

const EditUserScreen = () => {
   const navigate = useNavigate()
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   const params = useParams()
   const userId = params.id
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [isAdmin, setIsAdmin] = useState(false)
   const [errDes, setErrDes] = useState(null)

   const fetchSpecificUser = async () => {
      const config = {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      const value = await axios.get(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/users/${userId}`,
         config
      )
      if (value.message) {
         setErrDes(value.response.data.message)
      } else {
         setName(value.data.name)
         setEmail(value.data.email)
         setIsAdmin(value.data.isAdmin)
      }
   }

   const updateUserInformation = async () => {
      const config = {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      const value = await axios.put(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/users/${userId}`,
         { name, email, isAdmin },
         config
      )

      if (value.message) {
         setErrDes(value.response.data.message)
      } else {
         navigate('/admin/userList')
      }
   }

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
      }

      if (userLoginIn.isAdmin) {
         fetchSpecificUser()
      } else {
         navigate('/')
      }
   }, [])

   const submitHandler = (event) => {
      event.preventDefault()
      updateUserInformation()
   }

   return (
      <>
         <Link to='/admin/userList' className='btn btn-light my-3'>
            Go Back
         </Link>
         {errDes && <Message variant='danger'>{errDes}</Message>}
         <FormContainer>
            <h1>Edit User</h1>
            <Form onSubmit={submitHandler}>
               <Form.Group controlId='name'>
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                     className='text-center'
                     type='name'
                     placeholder='Enter name'
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
               </Form.Group>
               <Form.Group controlId='email'>
                  <Form.Label>Email Address:</Form.Label>
                  <Form.Control
                     className='text-center'
                     type='email'
                     placeholder='Enter email'
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
               </Form.Group>

               <Form.Group controlId='isadmin'>
                  <Form.Check
                     className='text-center'
                     type='checkbox'
                     label='Is Admin'
                     checked={isAdmin}
                     onChange={(e) => setIsAdmin(e.target.checked)}
                  ></Form.Check>
               </Form.Group>

               <Button type='submit' variant='primary'>
                  Update
               </Button>
            </Form>
         </FormContainer>
      </>
   )
}

export default EditUserScreen
