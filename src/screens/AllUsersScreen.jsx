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
import { FiSettings } from 'react-icons/fi'
import { FaTimesCircle } from 'react-icons/fa'
import { GiCheckMark } from 'react-icons/gi'

const AllUsersScreen = () => {
   const [allUsers, setAllUsers] = useState([])
   const navigate = useNavigate()
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   const [errDes, setErrDes] = useState(null)

   const fetchAllUsers = async () => {
      const config = {
         headers: {
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      const value = await axios.get(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/users`,
         config
      )
      if (value.message) {
         setErrDes(value.response.data.message)
      } else {
         await setAllUsers(value.data)
      }
   }

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
      }

      if (userLoginIn.isAdmin) {
         fetchAllUsers()
      } else {
         navigate('/')
      }
   }, [])

   const deleteHandler = async (id) => {
      if (window.confirm('Are you sure?')) {
         const config = {
            headers: {
               Authorization: `Bearer ${userLoginIn.token}`
            }
         }

         let value = await axios.delete(
            `${process.env.REACT_APP_BACK_ADDRESS}/api/users/${id}`,
            config
         )
         if (value.message) {
            setErrDes(value.response.data.message)
         } else {
            setErrDes('User Delete Successfully!')
            // Refresh to update the table
            fetchAllUsers()
         }
      }
   }

   const rowData = allUsers

   const [columnDefs, setColumnDefs] = useState([
      {
         headerName: 'User ID',
         field: '_id',
         width: 250,
         tooltipField: 'name'
      },
      { field: 'name', pinned: true },
      { field: 'email' },
      {
         headerName: 'Admin',
         field: 'isAdmin',
         cellRenderer: function (every_item) {
            return (
               <>
                  {every_item.data.isAdmin == false ? (
                     <FaTimesCircle color='red' />
                  ) : (
                     <GiCheckMark color='green' />
                  )}
               </>
            )
         }
      },
      {
         headerName: 'Options',
         cellRenderer: function (every_item) {
            console.log(every_item.data._id)
            return (
               <>
                  <LinkContainer to={`/admin/user/${every_item.data._id}/edit`}>
                     <Button
                        style={{
                           borderRadius: '5px',
                           fontSize: '18px'
                        }}
                        variant='secondary'
                     >
                        <FiSettings />
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
      <div className='ag-theme-alpine' style={{ height: 500 }}>
         {errDes && <Message variant='info'>{errDes}</Message>}
         <h1>All Users</h1>
         <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            animateRows={true}
            defaultColDef={defaultColDef}
         />

         {/* <h1>Users</h1>
         {errDes && <Message variant='danger'>{errDes}</Message>}
         {allUsers.map((user, key) => (
            <h1 key={user._id}>{user.name}</h1>
         ))} */}
      </div>
   )
}

export default AllUsersScreen
