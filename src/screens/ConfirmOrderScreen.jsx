import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import store from '../store'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CancelIcon from '@mui/icons-material/Cancel'

const ConfirmOrderScreen = () => {
   const navigate = useNavigate()
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   const [country, setCountry] = useState('')
   const [city, setCity] = useState('')
   const [streetandhousenumber, setStreetandhousenumber] = useState('')
   const [postalcode, setPostalcode] = useState('')
   const [cartItems, setCartItems] = useState([])
   const [totalCost, setTotalCost] = useState(0)
   let sum = Number(0)

   const sumFunction = (value) => {
      sum += value
   }

   const cleanTheCartItems = async () => {
      const config = {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      let val = await axios.post(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/users/cleanthecart`,
         {},
         config
      )

      if (val.message) {
         //Error
      } else {
      }
   }

   const createOrder = async () => {
      const config = {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      const value = await axios.post(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/orders`,
         {
            orderItems: cartItems,
            shippingAddress: {
               address: streetandhousenumber,
               city: city,
               postalCode: postalcode,
               country: country
            },
            totalPrice: sum.toFixed(2)
         },
         config
      )

      if (value.message) {
         //error
         console.log('Fail')
      } else {
         cleanTheCartItems()
         navigate(`/order/${value.data._id}`)
      }
   }

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
         //error
      } else {
         setCountry(value.data.country)
         setCity(value.data.city)
         setStreetandhousenumber(value.data.street_and_house)
         setPostalcode(value.data.postalcode)
         setCartItems(value.data.items_in_cart)
      }
   }

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
         fetchMyDetails()
      }
   }, [])

   return (
      <div style={{ textAlign: 'center' }}>
         <div
            style={{
               borderBottom: '1px solid black'
            }}
         >
            <h1>Confirm Your Order</h1>
         </div>
         <div style={{ borderBottom: '1px solid black', marginTop: '30px' }}>
            <h2>Shipping</h2>
            <h4>
               {streetandhousenumber}, {city}, {country}, {postalcode}
            </h4>
         </div>
         <div style={{ borderBottom: '1px solid black', marginTop: '30px' }}>
            <h2>Order Items</h2>

            <ListGroup variant='flush'>
               {cartItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                     <Row
                        style={{
                           display: 'flex',
                           flexDirection: 'center',
                           justifyContent: 'center',
                           alignItems: 'center'
                        }}
                     >
                        <Col md={1}>
                           <Image
                              src={`${process.env.REACT_APP_BACK_ADDRESS}/api/upload/products/${item.idOfProduct}/image`}
                              fluid
                              rounded
                           />
                        </Col>
                        <Col>
                           <Link to={`/product/${item.idOfProduct}`}>
                              {item.nameOfProduct}
                           </Link>
                        </Col>
                        <Col md={4}>
                           {item.qty} x ₪{item.priceOfProduct} = ₪
                           {(item.qty * item.priceOfProduct).toFixed(2)}
                           {sumFunction(item.qty * item.priceOfProduct)}
                        </Col>
                     </Row>
                  </ListGroup.Item>
               ))}
            </ListGroup>
         </div>
         <div style={{ borderBottom: '1px solid black', marginTop: '30px' }}>
            <h2>Order Summary</h2>
            <h5>Total items cost : {sum.toFixed(2)} ₪</h5>
            <h5>Shipping : Free Forever</h5>
         </div>
         <div style={{ borderBottom: '1px solid black', marginTop: '30px' }}>
            <Button
               startIcon={<CheckIcon />}
               variant='contained'
               color='success'
               onClick={() => {
                  createOrder()
               }}
            >
               Confirm
            </Button>{' '}
            <Button
               startIcon={<CancelIcon />}
               variant='contained'
               color='error'
               onClick={() => {
                  navigate('/cart')
               }}
            >
               Cancel
            </Button>
         </div>

         {/* <ListGroup variant='flush'>
            <ListGroup.Item>
               <h2>Shipping</h2>
               <p>
                  <strong>Address :</strong>
                  {cart.shippingAddress.address},{cart.shippingAddress.city},
                  {cart.shippingAddress.postalCode},
                  {cart.shippingAddress.country}
               </p>
            </ListGroup.Item>

            <ListGroup.Item>
               <h2>Payment Method</h2>
               <strong>Method: </strong>
               {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
               <h2>Order Items</h2>
               {cart.cartItems.length === 0 ? (
                  <Message>Your Cart Is Empty</Message>
               ) : (
                  <ListGroup variant='flush'>
                     {cart.cartItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                           <Row>
                              <Col md={1}>
                                 <Image
                                    src={item.image}
                                    alt={item.name}
                                    fluid
                                    rounded
                                 />
                              </Col>
                              <Col>
                                 <Link to={`/product/${item.product}`}>
                                    {item.name}
                                 </Link>
                              </Col>
                              <Col md={4}>
                                 {item.qty} x ₪{item.price} = ₪
                                 {(item.qty * item.price).toFixed(2)}
                              </Col>
                           </Row>
                        </ListGroup.Item>
                     ))}
                  </ListGroup>
               )}
            </ListGroup.Item>
         </ListGroup> */}
      </div>
   )
}

export default ConfirmOrderScreen
