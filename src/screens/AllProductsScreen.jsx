import React, { useState, useEffect, useMemo } from 'react'
import store from '../store'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Message from '../components/Message'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { LinkContainer } from 'react-router-bootstrap'
import { Button } from 'react-bootstrap'
import { FiTrash2 } from 'react-icons/fi'
import { GrEdit } from 'react-icons/gr'
import * as MUIALL from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

const AllProductsScreen = () => {
   const [allProducts, setAllProducts] = useState([])
   const navigate = useNavigate()
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   const [errDes, setErrDes] = useState(null)

   const createOrder = async (id) => {
      const config = {
         headers: {
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      let value = await axios.post(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/products`,
         {},
         config
      )
      console.log(value)
      if (value.message) {
         setErrDes(value.response.data.message)
      } else {
         navigate(`/admin/product/${value.data._id}/edit`)
         // Refresh to update the table
         //fetchAllProducts()
      }
   }

   const deleteHandler = async (id) => {
      if (window.confirm('Are you sure?')) {
         const config = {
            headers: {
               Authorization: `Bearer ${userLoginIn.token}`
            }
         }

         let value = await axios.delete(
            `${process.env.REACT_APP_BACK_ADDRESS}/api/products/${id}`,
            config
         )
         if (value.message) {
            setErrDes(value.response.data.message)
         } else {
            setErrDes('Product Delete Successfully!')
            // Refresh to update the table
            fetchAllProducts()
         }
      }
   }

   const fetchAllProducts = async () => {
      const value = await axios.get(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/products/admin`
      )
      if (value.message) {
         setErrDes(value.response.data.message)
      } else {
         await setAllProducts(value.data.products)
      }
   }

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
      }

      if (userLoginIn.isAdmin) {
         fetchAllProducts()
      } else {
         navigate('/')
      }
   }, [])

   const rowData = allProducts

   const [columnDefs, setColumnDefs] = useState([
      {
         field: 'image',
         //  cellRenderer: function (every_item) {
         //     return <>{every_item.data.image}</>
         //  },
         width: 150,
         pinned: true
      },
      { field: 'name', width: 240 },
      { field: 'price', width: 120 },
      {
         headerName: 'Product ID',
         field: '_id',
         width: 250
      },

      {
         headerName: 'Edit',
         cellRenderer: function (every_item) {
            return (
               <>
                  <LinkContainer
                     to={`/admin/product/${every_item.data._id}/edit`}
                  >
                     <Button
                        style={{
                           borderRadius: '5px',
                           fontSize: '18px'
                        }}
                        variant='secondary'
                     >
                        <GrEdit />
                     </Button>
                  </LinkContainer>
                  <Button
                     style={{ borderRadius: '5px', fontSize: '18px' }}
                     variant='secondary'
                     onClick={() => {
                        deleteHandler(every_item.data._id)
                     }}
                  >
                     <FiTrash2 />
                  </Button>
               </>
            )
         }
      }
   ])

   const defaultColDef = useMemo(
      () => ({
         sortable: true,
         filter: true,
         editable: true,
         resizable: true,
         minWidth: 120,
         maxWidth: 320
      }),
      []
   )

   return (
      <div className='ag-theme-alpine' style={{ height: 600 }}>
         {errDes && <Message variant='info'>{errDes}</Message>}
         <div
            style={{
               display: 'flex',
               flexDirection: 'row',
               justifyContent: 'center',
               marginBottom: '30px'
            }}
         >
            <h1 style={{ marginRight: '50px' }}>All Products</h1>
            <MUIALL.Button
               startIcon={<AddIcon />}
               variant='contained'
               color='success'
               onClick={() => {
                  createOrder()
               }}
            >
               Add Product
            </MUIALL.Button>{' '}
         </div>

         <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            animateRows={true}
            defaultColDef={defaultColDef}
         />
      </div>
   )
}

export default AllProductsScreen
