import React, { useState, useEffect } from 'react'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import store from '../store'
import { FiTrash2 } from 'react-icons/fi'
import axios from 'axios'
import Message from '../components/Message'

const CartScreen = () => {
   const navigate = useNavigate()
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   const [cartItems, setCartItems] = useState([])
   const [message, setMessage] = useState(null)

   const params = useParams()

   const checkoutHandler = () => {
      navigate('/shipping_address')
   }

   const removeFromCartHandler = async (id) => {
      const config = {
         headers: {
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      let val = await axios.delete(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/users/deletefromcart/${id}`,
         config
      )

      if (val.message) {
         setMessage(val.response.data.message)
      } else {
         fetchMyDetails()
         console.log('DID iT')
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
         setMessage(value.response.data.message)
      } else {
         setCartItems(value.data.items_in_cart)
      }
   }

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
         fetchMyDetails()
         console.log(process.env.REACT_APP_CHECK)
      } else {
         setMessage('You must to login')
      }
   }, [])

   return (
      <Row>
         <Col md={8}>
            <h1>Shopping Cart</h1>
            {message && <Message>{message}</Message>}
            {cartItems.length === 0 ? (
               <Message>
                  Your cart is empty <Link to='/'> Go Back</Link>
               </Message>
            ) : (
               <ListGroup variant='flush'>
                  <ListGroup.Item style={{ padding: '0px' }}>
                     <Row className='center'>
                        <Col md={2} className='center'>
                           Image
                        </Col>
                        <Col md={3} className='center'>
                           Name
                        </Col>
                        <Col md={2} className='center'>
                           Price ₪
                        </Col>
                        <Col md={1} className='center'>
                           Quantity
                        </Col>
                        <Col md={1} className='center'>
                           Size
                        </Col>
                        <Col md={2} className='center'>
                           Remove
                        </Col>
                     </Row>
                  </ListGroup.Item>
                  {cartItems.map((item) => (
                     <ListGroup.Item
                        key={item.idOfProduct}
                        style={{ padding: '5px' }}
                     >
                        <Row className='center'>
                           <Col md={2} className='center'>
                              <Image
                                 src={`${process.env.REACT_APP_BACK_ADDRESS}/api/upload/products/${item.idOfProduct}/image`}
                                 fluid
                                 rounded
                              />
                           </Col>
                           <Col md={3} className='center'>
                              <Link to={`/product/${item.idOfProduct}`}>
                                 {item.nameOfProduct}
                              </Link>
                           </Col>
                           <Col md={2} className='center'>
                              ₪{item.priceOfProduct}
                           </Col>
                           <Col md={1} className='center'>
                              {item.qty}
                           </Col>
                           <Col md={1} className='center'>
                              {item.size}
                           </Col>
                           <Col md={2} className='center'>
                              <Button
                                 type='button'
                                 variant='light'
                                 onClick={() => {
                                    removeFromCartHandler(item._id)
                                 }}
                              >
                                 <FiTrash2
                                    color='red'
                                    style={{ fontSize: '21px' }}
                                 />
                              </Button>
                           </Col>
                        </Row>
                     </ListGroup.Item>
                  ))}
               </ListGroup>
            )}
         </Col>
         <Col md={3}>
            <Card>
               <ListGroup variant='flush'>
                  <ListGroup.Item>
                     <h2>
                        Subtotal
                        <br /> (
                        {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                        items
                     </h2>

                     <h4>
                        ₪{'  '}
                        {cartItems
                           .reduce(
                              (acc, item) =>
                                 acc + item.qty * item.priceOfProduct,
                              0
                           )
                           .toFixed(2)}
                     </h4>
                  </ListGroup.Item>
                  <ListGroup.Item>
                     <Button
                        type='button'
                        className='btn-block'
                        disabled={cartItems.length === 0}
                        onClick={checkoutHandler}
                     >
                        Proceed To Checkout
                     </Button>
                  </ListGroup.Item>
               </ListGroup>
            </Card>
         </Col>
      </Row>
   )
}

export default CartScreen
