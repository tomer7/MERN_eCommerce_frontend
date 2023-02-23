import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import store from '../store'

const EditProductScreen = () => {
   const navigate = useNavigate()
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   const [errDes, setErrDes] = useState(null)
   const params = useParams()
   const productId = params.id
   const [name, setName] = useState('')
   const [price, setPrice] = useState(0)
   const [image, setImage] = useState(null)
   const [brand, setBrand] = useState('')
   const [countInStock, setCountInStock] = useState(0)
   const [description, setDescription] = useState(0)

   const uploadFileHandler = async (e) => {
      console.log('Before Before')
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('image', file)
      //setUploading(true)
      try {
         const config = {
            headers: {
               'Content-Type': 'multipart/form-data',
               Authorization: `Bearer ${userLoginIn.token}`
            }
         }
         console.log('Before Before')
         const { data } = await axios.post(
            `${process.env.REACT_APP_BACK_ADDRESS}/api/upload/${productId}`,
            formData,
            config
         )
         console.log('After Post:')
         console.log(data)
         //setImage(data)
         //setUploading(false)
         // setAfterUploading(true)
      } catch (error) {
         console.error(error)
         //setUploading(false)
      }
   }

   const submitHandler = async (event) => {
      event.preventDefault()
      const config = {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      const value = await axios.put(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/products/${productId}`,
         { name, price, brand, countInStock, description },
         config
      )

      if (value.message) {
         setErrDes(value.response.data.message)
      } else {
         navigate('/admin/productlist')
      }
   }

   const fetchProductDetails = async () => {
      const config = {
         headers: {
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      const value = await axios.get(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/products/${productId}`,
         config
      )

      if (value.message) {
         setErrDes(value.response.data.message)
      } else {
         await setName(value.data.name)
         await setPrice(value.data.price)
         await setImage(value.data.image)
         await setBrand(value.data.brand)
         await setCountInStock(value.data.countInStock)
         await setDescription(value.data.description)
      }
   }

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
      }

      if (userLoginIn.isAdmin) {
         fetchProductDetails()
      } else {
         navigate('/')
      }
   }, [])

   return (
      <>
         <Link to='/admin/productlist' className='btn btn-light my-3'>
            Go Back
         </Link>

         <FormContainer>
            <h1 style={{ borderBottom: '1px solid black' }}>Product Details</h1>
            {errDes && <Message variant='danger'>{errDes}</Message>}
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
               <Form.Group controlId='price'>
                  <Form.Label>Price:</Form.Label>
                  <Form.Control
                     className='text-center'
                     type='number'
                     placeholder='Enter price'
                     value={price}
                     onChange={(e) => setPrice(e.target.value)}
                  ></Form.Control>
               </Form.Group>

               <Form.Group controlId='image'>
                  <Form.Label>Image:</Form.Label>
                  <Form.Control
                     className='text-center'
                     type='text'
                     placeholder='Enter image url'
                     value={image}
                     onChange={(e) => setImage(e.target.value)}
                  ></Form.Control>
                  <Form.Control
                     type='file'
                     id='image-file'
                     label='Choose File'
                     custom
                     onChange={uploadFileHandler}
                  />
               </Form.Group>
               <Form.Group controlId='brand'>
                  <Form.Label>Brand:</Form.Label>
                  <Form.Control
                     className='text-center'
                     type='text'
                     placeholder='Enter brand'
                     value={brand}
                     onChange={(e) => setBrand(e.target.value)}
                  ></Form.Control>
               </Form.Group>
               <Form.Group controlId='countInStock'>
                  <Form.Label>Count In Stock:</Form.Label>
                  <Form.Control
                     className='text-center'
                     type='number'
                     placeholder='Enter count In Stock'
                     value={countInStock}
                     onChange={(e) => setCountInStock(e.target.value)}
                  ></Form.Control>
               </Form.Group>
               <Form.Group controlId='description'>
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                     className='text-center'
                     type='text'
                     placeholder='Enter description'
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                  ></Form.Control>
               </Form.Group>

               <Button type='submit' variant='primary'>
                  Update
               </Button>
            </Form>
         </FormContainer>
      </>
   )
}

export default EditProductScreen
