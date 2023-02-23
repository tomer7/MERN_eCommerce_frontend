import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import { TextField } from '@mui/material'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import store from '../store'
import { registerUser } from './functions'

const RegisterScreen = () => {
   const navigate = useNavigate()
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [message, setMessage] = useState(null)
   const [errDes, setErrDes] = useState(null)

   const submitHandler = async (event) => {
      event.preventDefault()
      if (password !== confirmPassword) {
         setMessage('Passwords do not match')
      } else {
         console.log('starting else')
         let value = await registerUser(name, email, password)
         if (value.message) {
            setErrDes(value.response.data.message)
         } else {
            setUserLoginIn(value)
            navigate('/')
         }
      }
   }

   useEffect(() => {
      if (resFromLS != null) {
         navigate('/')
      }
   }, [])

   return (
      <FormContainer>
         <h1>Sign Up</h1>
         {message && <Message variant='danger'>{message}</Message>}
         {errDes && <Message variant='danger'>{errDes}</Message>}
         {/* {loading && <Loader />} */}
         <form onSubmit={submitHandler}>
            <TextField
               id='outlined-basic'
               label='Name'
               variant='outlined'
               style={{ 'margin-bottom': '20px' }}
               value={name}
               onChange={(e) => setName(e.target.value)}
               fullWidth
               required
               helperText='Your full name.'
            />

            <TextField
               id='outlined-basic'
               label='Email'
               variant='outlined'
               style={{ 'margin-bottom': '20px' }}
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               fullWidth
               required
               helperText='Well never share your email.'
               type='email'
            />

            <TextField
               id='outlined-basic'
               label='Password'
               variant='outlined'
               style={{ 'margin-bottom': '20px' }}
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               type='password'
               fullWidth
               required
               helperText=' '
            />

            <TextField
               id='outlined-basic'
               label='Confirm Password'
               variant='outlined'
               style={{ 'margin-bottom': '20px' }}
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               type='password'
               fullWidth
               required
               helperText=' '
            />

            <Button type='submit' variant='primary'>
               Register
            </Button>
         </form>

         <Row className='py-3'>
            <Col>
               Have an Account? <Link to='/login'>Login</Link>
            </Col>
         </Row>
      </FormContainer>
   )
}

export default RegisterScreen
