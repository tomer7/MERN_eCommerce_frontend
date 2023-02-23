import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'
import store from '../store'
import Message from '../components/Message'

const ShippingAddressScreen = () => {
   const navigate = useNavigate()
   let resFromLS = JSON.parse(localStorage.getItem('UserLoginInLS'))
   const [userLoginIn, setUserLoginIn] = store.useState('userLoginIn')
   let [countries, setCountries] = useState([])
   let [singleCountry, setSingleCountry] = useState('')
   let [Cities, setCities] = useState([])
   let [singleCity, setSingleCity] = useState('')
   const [streetandhousenumber, setStreetandhousenumber] = useState('')
   const [postalcode, setPostalcode] = useState('')
   const [message, setMessage] = useState(null)

   const submitHandler = async (event) => {
      event.preventDefault()
      const config = {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userLoginIn.token}`
         }
      }

      let value = await axios.post(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/users/add_address`,
         {
            country: singleCountry,
            city: singleCity,
            streetandhousenumber,
            postalcode
         },
         config
      )

      if (value.message) {
         setMessage('Error')
      } else {
         navigate('/confirmorder')
      }
   }

   const fetchCountries = async () => {
      let country = await axios.get(
         'https://countriesnow.space/api/v0.1/countries'
      )

      setCountries(country.data.data)
   }
   const fetchCities = (country) => {
      const Cities = countries.find((c) => c.country === country)
      setCities(Cities.cities)
      setSingleCountry(country)
   }

   useEffect(() => {
      if (resFromLS != null) {
         setUserLoginIn(resFromLS)
         fetchCountries()
      } else {
         navigate('/')
      }
   }, [])

   return (
      <FormContainer>
         <h1>Shipping</h1>
         <h4 style={{ marginBottom: '40px' }}>Choose your address</h4>
         {message && <Message>{message}</Message>}
         <Form onSubmit={submitHandler}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               {countries && (
                  <select
                     style={{ marginBottom: '50px' }}
                     onChange={(e) => fetchCities(e.target.value)}
                  >
                     <option selected hidden disabled>
                        Select your country
                     </option>
                     {countries.map((country) => (
                        <option
                           key={`${country.country}`}
                           value={country.country}
                        >
                           {country.country}
                        </option>
                     ))}
                  </select>
               )}
               {Cities && (
                  <select
                     style={{ marginBottom: '50px' }}
                     onChange={(e) => {
                        setSingleCity(e.target.value)
                     }}
                  >
                     <option selected hidden disabled>
                        Select your city
                     </option>
                     {Cities.map((city) => (
                        <option key={`${city}`} value={city}>
                           {city}
                        </option>
                     ))}
                  </select>
               )}
            </div>

            <Form.Group controlId='address'>
               <Form.Label>Street and house number :</Form.Label>
               <Form.Control
                  className='text-center'
                  type='text'
                  placeholder='Enter street and house number'
                  value={streetandhousenumber}
                  required
                  onChange={(e) => setStreetandhousenumber(e.target.value)}
               ></Form.Control>
            </Form.Group>
            <Form.Group controlId='postalCode'>
               <Form.Label>Postal Code :</Form.Label>
               <Form.Control
                  className='text-center'
                  type='text'
                  placeholder='Enter Postal Code'
                  value={postalcode}
                  required
                  onChange={(e) => setPostalcode(e.target.value)}
               ></Form.Control>
            </Form.Group>

            <Button
               type='submit'
               variant='primary'
               style={{ marginTop: '25px' }}
            >
               Continue
            </Button>
         </Form>
      </FormContainer>
   )
}

export default ShippingAddressScreen
