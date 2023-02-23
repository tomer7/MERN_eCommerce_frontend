import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import store from '../store'
import { useParams, Link } from 'react-router-dom'
import SearchBox from '../components/SearchBox'
import Paginate from '../components/Paginate'

const HomeScreen = () => {
   const [products, setProducts] = store.useState('products')
   //const [products, setProducts] = useState([])
   const [page, setPage] = useState(0)
   const [pages, setPages] = useState(0)
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   const params = useParams()
   const keyword = params.keyword || ''
   const pageNumber = params.pageNumber || 1

   const fetchProductsFromDB = async () => {
      let value = await axios.get(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
      )
      console.log('value::')
      console.log(value)
      setProducts(value.data.products)
      setPage(value.data.page)
      setPages(value.data.pages)
   }

   useEffect(() => {
      fetchProductsFromDB()
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
      }
   }, [pageNumber, keyword])

   return (
      <>
         {!keyword ? (
            <h1
               style={{
                  textAlign: 'center',
                  paddingBottom: '0px',
                  marginBottom: '4px'
               }}
            >
               All items
            </h1>
         ) : (
            <Link to='/' className='btn btn-light'>
               Go back
            </Link>
         )}
         <Row>
            {/* <div
               style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
               }}
            >
               <h1
                  style={{
                     textAlign: 'left',
                     paddingBottom: '0px',
                     marginBottom: '4px'
                  }}
               >
                  All items
               </h1>
            </div> */}
            {products.map((product) => (
               <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
               </Col>
            ))}
         </Row>
         <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
      </>
   )
}

export default HomeScreen
