import React, { useState, useEffect, useCallback } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import store from '../store'

import '@fontsource/pacifico'
import '@fontsource/poppins'
import '@fontsource/roboto-mono'
import { Image, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import SearchIcon from '@mui/icons-material/Search'
import { styled, alpha } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import SearchBox from './SearchBox'
// ICONS
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PersonIcon from '@mui/icons-material/Person'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import GitHubIcon from '@mui/icons-material/GitHub'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import NavLogo from './logo.jpg'

const useStyles = makeStyles((theme) => ({
   AllAppBarDesktop: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#0a192f',
      minHeight: '90px'
   },
   AllAppBarMobile: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
   },
   LogoDiv: {
      marginBottom: '8px',
      color: '#64ffda'
   },
   MenuOptions: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center'
   },
   IconsDiv: {
      display: 'flex',
      alignItems: 'center'
   },
   HamburgerInMobile: {},
   logo: {
      maxWidth: '75px'
   },
   logoInMobile: {
      maxWidth: '45px'
   }
}))

const theme = createTheme({
   breakpoints: {
      values: {
         p770: 770,
         desktop: 1200
      }
   }
})

const Header = () => {
   const navigate = useNavigate()

   // const [user, setUser] = useState()
   // const [anchorEl, setAnchorEl] = useState(null)
   const classes = useStyles()
   const isMobile = useMediaQuery(theme.breakpoints.down('p770'))
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   //const [count_for_cart, setCount_for_cart] = store.useState('conuntforcart')

   const logoutHandler = () => {
      localStorage.removeItem('UserLoginInLS')
      setUserLoginIn({})
      navigate('/')
   }

   const handleButtonClick = (pageURL) => {
      navigate(pageURL)
   }

   const [y, setY] = useState(window.scrollY)
   const [positionAppBar, setPositionAppBar] = useState('fixed')

   const handleNavigation = useCallback(
      (e) => {
         const window = e.currentTarget
         if (y > window.scrollY) {
            console.log('scrolling up')
            setPositionAppBar('fixed')
         } else if (y < window.scrollY && window.scrollY > 50) {
            console.log('scrolling down')
            setPositionAppBar('absolute')
         }
         setY(window.scrollY)
      },
      [y]
   )

   useEffect(() => {
      setY(window.scrollY)
      window.addEventListener('scroll', handleNavigation)

      return () => {
         window.removeEventListener('scroll', handleNavigation)
      }
   }, [handleNavigation])

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
      }
   }, [])

   return (
      <Box sx={{ flexGrow: 1 }}>
         <AppBar
            sx={
               positionAppBar == 'absolute'
                  ? {
                       backgroundColor: '#0a192f',
                       transform: 'translateY(-100px)',
                       transition: '0.5s ease'
                    }
                  : {
                       transform: 'translateY(0px)',
                       transition: '0.5s ease',
                       backgroundColor: '#0a192f',
                       boxShadow: '0 0 0 0 '
                    }
            }
            color='inherit'
            position='fixed'
         >
            <Toolbar>
               {isMobile ? (
                  <>
                     <div className={classes.AllAppBarMobile}>
                        <div data-aos='fade-down' className={classes.IconsDiv}>
                           {userLoginIn.name ? (
                              <NavDropdown
                                 title={userLoginIn.name}
                                 id='username'
                                 style={{
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    marginRight: '10px'
                                 }}
                              >
                                 <LinkContainer to='/profile-options'>
                                    <NavDropdown.Item>Profile</NavDropdown.Item>
                                 </LinkContainer>

                                 {userLoginIn.isAdmin && (
                                    <>
                                       <LinkContainer to='/admin/userlist'>
                                          <NavDropdown.Item>
                                             Users
                                          </NavDropdown.Item>
                                       </LinkContainer>
                                       <LinkContainer to='/admin/productlist'>
                                          <NavDropdown.Item>
                                             Products
                                          </NavDropdown.Item>
                                       </LinkContainer>
                                       <LinkContainer to='/admin/orderlist'>
                                          <NavDropdown.Item>
                                             Orders
                                          </NavDropdown.Item>
                                       </LinkContainer>
                                    </>
                                 )}
                                 <NavDropdown.Item onClick={logoutHandler}>
                                    Logout
                                 </NavDropdown.Item>
                              </NavDropdown>
                           ) : (
                              <PersonIcon
                                 onClick={() => handleButtonClick('/login')}
                                 sx={{
                                    fontSize: '2.8rem',
                                    color: '#ccd6f6'
                                 }}
                              />
                           )}
                           <div>
                              <ShoppingCartIcon
                                 onClick={() => handleButtonClick('/cart')}
                                 sx={{
                                    fontSize: '2.3rem',
                                    color: '#ccd6f6'
                                 }}
                              />
                           </div>
                           {/* <DarkModeOutlinedIcon
                              sx={{ fontSize: '1.6rem', color: '#ccd6f6' }}
                           /> */}
                        </div>
                        <div style={{ width: '35%' }}>
                           <SearchBox />
                        </div>

                        <div
                           data-aos='fade-down'
                           data-aos-delay='150'
                           className={classes.LogoDiv}
                           onClick={() => handleButtonClick('/')}
                        >
                           <img
                              src={NavLogo}
                              alt='logo'
                              className={classes.logoInMobile}
                              style={{
                                 paddingTop: '7px'
                              }}
                           />
                        </div>
                        <div
                           data-aos='fade-down'
                           data-aos-delay='300'
                           className={classes.HamburgerInMobile}
                        ></div>
                     </div>
                  </>
               ) : (
                  <>
                     <div className={classes.AllAppBarDesktop}>
                        <div
                           data-aos='fade-down'
                           className={classes.LogoDiv}
                           onClick={() => handleButtonClick('/')}
                        >
                           <img
                              src={NavLogo}
                              alt='logo'
                              className={classes.logo}
                              style={{
                                 paddingTop: '7px'
                              }}
                           />
                        </div>

                        <div className={classes.MenuOptions}>
                           <SearchBox />
                        </div>
                        <div
                           data-aos-delay='400'
                           data-aos='fade-down'
                           className={classes.IconsDiv}
                        >
                           {/* <DarkModeOutlinedIcon
                              sx={{ fontSize: '1.7rem', color: '#ccd6f6' }}
                           /> */}

                           {userLoginIn.name ? (
                              <NavDropdown
                                 title={userLoginIn.name}
                                 id='username'
                                 style={{
                                    backgroundColor: 'white',
                                    borderRadius: '10px'
                                 }}
                              >
                                 <LinkContainer to='/profile-options'>
                                    <NavDropdown.Item>Profile</NavDropdown.Item>
                                 </LinkContainer>

                                 {userLoginIn.isAdmin && (
                                    <>
                                       <LinkContainer to='/admin/userlist'>
                                          <NavDropdown.Item>
                                             Users
                                          </NavDropdown.Item>
                                       </LinkContainer>
                                       <LinkContainer to='/admin/productlist'>
                                          <NavDropdown.Item>
                                             Products
                                          </NavDropdown.Item>
                                       </LinkContainer>
                                       <LinkContainer to='/admin/orderlist'>
                                          <NavDropdown.Item>
                                             Orders
                                          </NavDropdown.Item>
                                       </LinkContainer>
                                    </>
                                 )}
                                 <NavDropdown.Item onClick={logoutHandler}>
                                    Logout
                                 </NavDropdown.Item>
                              </NavDropdown>
                           ) : (
                              <PersonIcon
                                 onClick={() => handleButtonClick('/login')}
                                 sx={{
                                    fontSize: '2.7rem',
                                    color: '#ccd6f6'
                                 }}
                              />
                           )}

                           <ShoppingCartIcon
                              onClick={() => handleButtonClick('/cart')}
                              sx={{
                                 fontSize: '2.6rem',
                                 color: '#ccd6f6'
                              }}
                           />

                           {/* {userLoginIn.name && (
                              <span
                                 className='badge badge-warning'
                                 id='lblCartCount'
                              >
                                 {count_for_cart}
                              </span>
                           )} */}
                        </div>
                     </div>
                  </>
               )}
            </Toolbar>
         </AppBar>
      </Box>
   )
}

export default Header
