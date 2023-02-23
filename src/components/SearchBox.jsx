import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { styled, alpha } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Form } from 'react-bootstrap'
import { Button } from '@mui/material'

const Search = styled('div')(({ theme }) => ({
   position: 'relative',
   borderRadius: theme.shape.borderRadius,
   backgroundColor: alpha(theme.palette.common.white, 0.15),
   '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
   },
   marginLeft: 0,
   width: '100%',
   [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
   },
   border: '1px solid black'
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
   padding: theme.spacing(0, 2),
   height: '100%',
   position: 'absolute',
   pointerEvents: 'none',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   color: 'white'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
   color: 'inherit',
   '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      color: 'white',
      [theme.breakpoints.up('sm')]: {
         width: '12ch',
         '&:focus': {
            width: '20ch'
         }
      }
   }
}))

const SearchBox = () => {
   const navigate = useNavigate()
   const [keyword, setKeyword] = useState('')

   // const ClickTheSearchButton = () => {
   //    console.log('keyword::')
   //    console.log(keyword)
   //    if (keyword) {
   //       navigate.apply(`/search/${keyword}`)
   //    } else {
   //       navigate('/')
   //    }
   // }

   useEffect(() => {
      if (keyword.trim()) {
         navigate(`/search/${keyword}`)
      } else {
         navigate('/')
      }
   }, [keyword])

   // useEffect(() => {
   //    if (keyword) {
   //       navigate(`/search/${keyword}`)
   //    } else {
   //       navigate('/')
   //    }
   // }, [keyword])

   return (
      <>
         <Search>
            <SearchIconWrapper>
               <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
               onChange={(e) => {
                  setKeyword(e.target.value)
               }}
               value={keyword}
               placeholder='Search…'
               inputProps={{ 'aria-label': 'search' }}
            />
         </Search>
         {/* <Button
            variant='outlined'
            onClick={() => {
               ClickTheSearchButton()
            }}
         >
            Search
         </Button> */}
      </>
      // <Form
      //    style={{
      //       display: 'flex',
      //       flexDirection: 'row'
      //    }}
      //    inline
      // >
      //    <Form.Control
      //       style={{
      //          marginRight: '5px',
      //          borderRadius: '50px'
      //       }}
      //       className='inputDesign'
      //       type='text'
      //       name='q'
      //       onChange={(e) => {
      //          setKeyword(e.target.value)
      //       }}
      //       placeholder='Search Products...'
      //       value={keyword}
      //    ></Form.Control>
      //    <FontAwesomeIcon
      //       icon={faMagnifyingGlass}
      //       size='2x'
      //       style={{ color: 'black', paddingTop: '10px' }}
      //    />
      //    {/* <Button
      //       style={{
      //          borderRadius: '50px'
      //       }}
      //       type='submit'
      //       variant='dark'
      //       className='p-2'
      //    >
      //       Search
      //    </Button> */}
      // </Form>
   )
}

export default SearchBox
