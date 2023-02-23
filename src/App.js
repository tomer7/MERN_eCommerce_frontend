import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header2 from './components/Header-2'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileOptionsScreen from './screens/ProfileOptionsScreen'
import EditProfileDetailsScreen from './screens/EditProfileDetailsScreen'
import ProfileOrdersScreen from './screens/ProfileOrdersScreen'
import AllUsersScreen from './screens/AllUsersScreen'
import AllProductsScreen from './screens/AllProductsScreen'
import AllOrdersScreen from './screens/AllOrdersScreen'
import EditUserScreen from './screens/EditUserScreen'
import EditProductScreen from './screens/EditProductScreen'
import ShippingAddressScreen from './screens/ShippingAddressScreen'
import ConfirmOrderScreen from './screens/ConfirmOrderScreen'
import OrderScreen from './screens/OrderScreen'
import Footer from './components/Footer'

const App = () => {
   return (
      <Router>
         <h1></h1>
         <h1></h1>
         <Header2 />
         <main className='py-3'>
            <Container>
               <Routes>
                  <Route path='/' element={<HomeScreen />} />
                  <Route path='/product/:id' element={<ProductScreen />} />
                  <Route path='/cart/' element={<CartScreen />} />
                  <Route
                     path='/shipping_address/'
                     element={<ShippingAddressScreen />}
                  />
                  <Route
                     path='/confirmorder/'
                     element={<ConfirmOrderScreen />}
                  />
                  <Route path='/order/:id' element={<OrderScreen />} />
                  <Route path='/login' element={<LoginScreen />} />
                  <Route path='/register' element={<RegisterScreen />} />
                  <Route
                     path='/profile-options'
                     element={<ProfileOptionsScreen />}
                  />
                  <Route
                     path='/profile-details'
                     element={<EditProfileDetailsScreen />}
                  />
                  <Route
                     path='/profile-orders'
                     element={<ProfileOrdersScreen />}
                  />
                  <Route path='/admin/userlist' element={<AllUsersScreen />} />
                  <Route
                     path='/admin/productlist'
                     element={<AllProductsScreen />}
                  />
                  <Route
                     path='/admin/orderlist'
                     element={<AllOrdersScreen />}
                  />
                  <Route
                     path='/admin/user/:id/edit'
                     element={<EditUserScreen />}
                  />
                  <Route
                     path='/admin/product/:id/edit'
                     element={<EditProductScreen />}
                  />
                  <Route path='/search/:keyword' element={<HomeScreen />} />
                  <Route path='/page/:pageNumber' element={<HomeScreen />} />
                  <Route
                     path='/search/:keyword/page/:pageNumber'
                     element={<HomeScreen />}
                  />
               </Routes>
            </Container>
         </main>
         <Footer />
      </Router>
   )
}

export default App
