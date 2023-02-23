import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import store from '../store'
import {
   Link,
   Navigate,
   useLocation,
   useNavigate,
   useParams
} from 'react-router-dom'
import Message from '../components/Message'
import { PayPalButton } from 'react-paypal-button-v2'

const OrderScreen = () => {
   const params = useParams()
   const orderId = params.id
   const navigate = useNavigate()
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   const [sdkReady, setSdkReady] = useState(false)
   const [paymentResult, setPaymentResult] = useState({})
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [order, setOrder] = useState({
      _id: '',
      shippingAddress: { address: '', city: '', postalCode: '', country: '' },
      orderItems: []
   })

   const deliverHandler = async () => {
      const config = {
         headers: {
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      const { data } = await axios.put(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/orders/${orderId}/deliver`,
         {},
         config
      )

      getOrderDetails()
   }

   const successPaymentHandler = async (paymentResult) => {
      console.log('paymentResult ::::')
      console.log(paymentResult)

      const config = {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      const { data } = await axios.put(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/orders/${orderId}/pay`,
         paymentResult,
         config
      )

      console.log('After Axios put payment result')
      console.log(data)
      setPaymentResult(paymentResult)
      getOrderDetails()
   }

   const getOrderDetails = async () => {
      const config = {
         headers: {
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }
      console.log('Before axios')
      const value = await axios.get(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/orders/${orderId}`,
         config
      )

      if (value.message) {
         //    setMessage(value.response.data.message)
      } else {
         setOrder(value.data)
         setName(value.data.user.name)
         setEmail(value.data.user.email)
      }
   }

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
         getOrderDetails()
      }

      const addPayPalScript = async () => {
         const { data } = await axios.get(
            `${process.env.REACT_APP_BACK_ADDRESS}/api/config/paypal`
         )
         const clientId = data
         const script = document.createElement('script')
         script.type = 'text/javascript'
         script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
         script.async = true
         script.onload = () => {
            setSdkReady(true)
         }
         document.body.appendChild(script)
      }

      if (!order.isPaid) {
         if (!window.paypal) {
            addPayPalScript()
         } else {
            setSdkReady(true)
         }
      }
   }, [])

   return (
      <>
         <h1>Order {order._id}</h1>
         <Row>
            <Col md={8}>
               <ListGroup variant='flush'>
                  <ListGroup.Item>
                     <h2>Shipping</h2>
                     <p>
                        <strong>Name: </strong>
                        {name}
                     </p>
                     <p>
                        <strong>Email: </strong>
                        <a href={`mailto:${email}`}>{email}</a>
                     </p>
                     <p>
                        <strong>Address :</strong>
                        {order.shippingAddress.address},
                        {order.shippingAddress.city},
                        {order.shippingAddress.country},
                        {order.shippingAddress.postalCode}
                     </p>
                     {order.isDelivered ? (
                        <Message variant='success'>
                           Delivered on{' '}
                           {order.deliveredAt
                              .substring(0, 10)
                              .split('-')
                              .reverse()
                              .join('-')}
                        </Message>
                     ) : (
                        <Message variant='danger'>Not Delivered</Message>
                     )}
                  </ListGroup.Item>

                  <ListGroup.Item>
                     <h2>Payment Method</h2>
                     <p>
                        <strong>Method: </strong>
                        PayPal
                     </p>
                     {order.isPaid ? (
                        <Message variant='success'>
                           Paid on{' '}
                           {order.paymentResult.update_time
                              .substring(0, 10)
                              .split('-')
                              .reverse()
                              .join('-')}
                        </Message>
                     ) : (
                        <Message variant='danger'>Not Paid</Message>
                     )}
                  </ListGroup.Item>

                  <ListGroup.Item>
                     <h2>Order Items</h2>
                     {order.orderItems.length === 0 ? (
                        <Message>Order Is Empty</Message>
                     ) : (
                        <ListGroup variant='flush'>
                           {order.orderItems.map((item, index) => (
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
                                       <Link
                                          to={`/product/${item.idOfProduct}`}
                                       >
                                          {item.nameOfProduct}
                                       </Link>
                                    </Col>
                                    <Col md={4}>
                                       {item.qty} x ₪{item.priceOfProduct} = ₪
                                       {(
                                          item.qty * item.priceOfProduct
                                       ).toFixed(2)}
                                    </Col>
                                 </Row>
                              </ListGroup.Item>
                           ))}
                        </ListGroup>
                     )}
                  </ListGroup.Item>
               </ListGroup>
            </Col>
            <Col md={4}>
               <Card>
                  <ListGroup variant='flush'>
                     <ListGroup.Item>
                        <h2>Order Summary</h2>
                     </ListGroup.Item>
                     <ListGroup.Item>
                        <Row>
                           <Col>Total Price</Col>
                           <Col>₪{order.totalPrice}</Col>
                        </Row>
                     </ListGroup.Item>
                     <ListGroup.Item>
                        <Row>
                           <Col>Shipping</Col>
                           <Col>Free Forever</Col>
                        </Row>
                     </ListGroup.Item>
                     {!order.isPaid ? (
                        <ListGroup.Item>
                           <PayPalButton
                              amount={order.totalPrice}
                              onSuccess={successPaymentHandler}
                           />
                        </ListGroup.Item>
                     ) : (
                        <ListGroup.Item
                           style={{
                              textAlign: 'center',
                              border: '1px solid green',
                              borderRadius: '5px',
                              marginTop: '30px'
                           }}
                        >
                           <h2>Already Paid</h2>
                        </ListGroup.Item>
                     )}

                     {userLoginIn &&
                        userLoginIn.isAdmin &&
                        order.isPaid &&
                        !order.isDelivered && (
                           <ListGroup.Item>
                              <Button
                                 type='button'
                                 className='btn btn-block'
                                 onClick={() => {
                                    deliverHandler()
                                 }}
                              >
                                 Mark as Delivered
                              </Button>
                           </ListGroup.Item>
                        )}
                  </ListGroup>
               </Card>
            </Col>
         </Row>
      </>
   )
}

export default OrderScreen
