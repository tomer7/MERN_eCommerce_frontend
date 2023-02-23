import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import { TextField } from '@mui/material'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import store from '../store'
import { loginUser } from './functions'

const LoginScreen = () => {
   const navigate = useNavigate()
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')

   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [errDes, setErrDes] = useState(null)

   const submitHandler = async (event) => {
      event.preventDefault()

      let value = await loginUser(email, password)
      if (value.message) {
         setErrDes(value.response.data.message)
      } else {
         setUserLoginIn(value)
         navigate('/')
      }
   }

   useEffect(() => {
      if (resFromLS != null) {
         navigate('/')
      }
   }, [])

   return (
      <FormContainer>
         <form onSubmit={submitHandler}>
            <h1>Login</h1>
            {errDes && <Message variant='danger'>{errDes}</Message>}
            {/* {loading && <Loader />} */}
            <TextField
               id='outlined-basic'
               label='Email'
               variant='outlined'
               style={{ 'margin-bottom': '20px' }}
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               type='email'
               fullWidth
               required
               helperText='Well never share your email.'
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
               helperText='Well never share your password.'
            />
            <Form.Group controlId='signIn'>
               <Button type='submit' variant='primary'>
                  Sign In
               </Button>
            </Form.Group>
            <Row className='py-3'>
               <Col>
                  New Customer? <Link to='/register'>Register</Link>
               </Col>
            </Row>
         </form>
      </FormContainer>
   )
}

export default LoginScreen
