import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import store from '../store'
import Message from '../components/Message'

const ProductScreen = () => {
   const navigate = useNavigate()
   const params = useParams()
   const [products, setProducts] = store.useState('products')
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   const [qty, setQty] = useState(1)
   const [size, setSize] = useState(36)
   const [message, setMessage] = useState(null)
   const arraySizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
   const product = products.find((item) => item._id === params.id)
   //let myVar = product._id.valueOf()
   const AddToCart = async () => {
      console.log('AddToCart Func')
      const config = {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }
      console.log('after config')
      let value = await axios.post(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/users/addtocart`,
         {
            idOfProduct: product._id,
            qty,
            size,
            //imageOfProduct: product.image,
            nameOfProduct: product.name,
            priceOfProduct: product.price
         },
         config
      )
      console.log('Post did :')
      console.log(value)
      if (value.data.message == 'Saved') {
         navigate('/cart')
      } else {
         setMessage('Error')
      }
   }

   const addToCartHandler = () => {
      if (resFromLS != null) {
         AddToCart()
      } else {
         navigate('/login')
      }
   }

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
      }
   }, [])

   return (
      <>
         <Link className='btn btn-light my-3' to='/'>
            Go back
         </Link>
         {message && <Message variant='danger'>{message}</Message>}
         <Row>
            <Col md={6}>
               {/* fluid keep the img inside of the container */}

               <Image
                  src={`${process.env.REACT_APP_BACK_ADDRESS}/api/upload/products/${params.id}/image`}
                  alt={product.name}
                  fluid
               />
            </Col>
            <Col md={3}>
               <ListGroup variant='flush'>
                  <ListGroup.Item>
                     <h3>{product.name}</h3>
                  </ListGroup.Item>
                  {/* <ListGroup.Item>
                           <Rating
                              value={product.rating}
                              text={`₪{product.numReviews} reviews`}
                           />
                        </ListGroup.Item> */}
                  <ListGroup.Item className='py-3'>
                     Price : ₪{product.price}
                  </ListGroup.Item>
                  <ListGroup.Item>
                     Description : {product.description}
                  </ListGroup.Item>
               </ListGroup>
            </Col>
            <Col md={3}>
               <Card>
                  <ListGroup variant='flush'>
                     <ListGroup.Item>
                        <Row>
                           <Col>Price:</Col>
                           <Col>
                              <strong>₪{product.price}</strong>
                           </Col>
                        </Row>
                     </ListGroup.Item>
                     <ListGroup.Item>
                        <Row>
                           <Col>Status:</Col>
                           <Col>
                              {product.countInStock > 0
                                 ? 'In Stock'
                                 : 'Out Of Stock'}
                           </Col>
                        </Row>
                     </ListGroup.Item>

                     {product.countInStock > 0 ? (
                        <ListGroup.Item>
                           <Row>
                              <Col>Qty:</Col>
                              <Col>
                                 <Form.Select
                                    style={{ border: '1px black solid' }}
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                 >
                                    {[
                                       ...Array(product.countInStock).keys()
                                    ].map((x) => (
                                       <option key={x + 1} value={x + 1}>
                                          {x + 1}
                                       </option>
                                    ))}
                                 </Form.Select>
                              </Col>
                           </Row>
                        </ListGroup.Item>
                     ) : (
                        <ListGroup.Item>
                           <Row>
                              <Col>Qty:</Col>
                              <Col>Not in stock at the moment</Col>
                           </Row>
                        </ListGroup.Item>
                     )}
                     <ListGroup.Item>
                        <Row>
                           <Col>Size:</Col>
                           <Col>
                              <Form.Select
                                 style={{ border: '1px black solid' }}
                                 value={size}
                                 onChange={(e) => setSize(e.target.value)}
                              >
                                 {arraySizes.map((x) => (
                                    <option>{x}</option>
                                 ))}
                              </Form.Select>
                           </Col>
                        </Row>
                     </ListGroup.Item>
                     <ListGroup.Item>
                        <Button
                           onClick={addToCartHandler}
                           className='btn-block'
                           type='button'
                           disabled={product.countInStock === 0}
                        >
                           Add To Cart
                        </Button>
                     </ListGroup.Item>
                  </ListGroup>
               </Card>
            </Col>
         </Row>
      </>
   )
}

export default ProductScreen
