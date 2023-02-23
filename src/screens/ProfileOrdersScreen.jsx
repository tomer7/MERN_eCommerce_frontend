import axios from 'axios'
import React, { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import store from '../store'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import Message from '../components/Message'
import { LinkContainer } from 'react-router-bootstrap'
import { Button } from 'react-bootstrap'
import { IoIosInformationCircleOutline } from 'react-icons/io'
import { FaTimesCircle } from 'react-icons/fa'

const ProfileOrdersScreen = () => {
   const [profileOrders, setProfileOrders] = useState([])
   const navigate = useNavigate()
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   const [errDes, setErrDes] = useState(null)

   const fetchMyOrders = async () => {
      const config = {
         headers: {
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      const value = await axios.get(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/orders/myorders`,
         config
      )

      if (value.message) {
         setErrDes(value.response.data.message)
      } else {
         await setProfileOrders(value.data)
      }
   }

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
         fetchMyOrders()
      } else {
         navigate('/')
      }
   }, [])

   const rowData = profileOrders

   const [columnDefs, setColumnDefs] = useState([
      {
         headerName: 'Created At',
         field: 'createdAt',
         cellRenderer: function (every_item) {
            return (
               <>
                  {every_item.data.createdAt
                     .substring(0, 10)
                     .split('-')
                     .reverse()
                     .join('-')}
               </>
            )
         },
         width: 150,
         pinned: true
      },
      {
         headerName: 'Order ID',
         field: '_id',
         width: 250,
         tooltipField: 'name'
      },
      { headerName: 'Total Price', field: 'totalPrice', width: 140 },
      {
         headerName: 'Is Paid ?',
         field: 'isPaid',
         cellRenderer: function (every_item) {
            return (
               <>
                  {every_item.data.isPaid == false ? (
                     <FaTimesCircle color='red' />
                  ) : (
                     every_item.data.paymentResult.update_time
                        .substring(0, 10)
                        .split('-')
                        .reverse()
                        .join('-')
                  )}
               </>
            )
         },
         width: 80
      },
      {
         headerName: 'Is Delivered ?',
         field: 'isDelivered',
         cellRenderer: function (every_item) {
            return (
               <>
                  {every_item.data.isDelivered == false ? (
                     <FaTimesCircle color='red' />
                  ) : (
                     every_item.data.deliveredAt
                        .substring(0, 10)
                        .split('-')
                        .reverse()
                        .join('-')
                  )}
               </>
            )
         },
         width: 150
      },
      {
         headerName: 'Details',
         cellRenderer: function (every_item) {
            console.log(every_item.data._id)
            return (
               <>
                  <LinkContainer to={`/order/${every_item.data._id}`}>
                     <Button
                        style={{
                           borderRadius: '5px',
                           fontSize: '18px'
                        }}
                        variant='secondary'
                     >
                        <IoIosInformationCircleOutline />
                     </Button>
                  </LinkContainer>
               </>
            )
         },
         width: 80
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
      <>
         <Link to='/profile-options' className='btn btn-light my-3'>
            Go Back
         </Link>
         <div className='ag-theme-alpine' style={{ height: 600 }}>
            {errDes && <Message variant='danger'>{errDes}</Message>}
            <h1>My Orders</h1>
            <AgGridReact
               rowData={rowData}
               columnDefs={columnDefs}
               animateRows={true}
               defaultColDef={defaultColDef}
            />
         </div>
      </>
   )
}

export default ProfileOrdersScreen
