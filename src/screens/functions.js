import axios from 'axios'

const loginUser = async (email, password) => {
   const config = {
      headers: {
         'Content-Type': 'application/json'
      }
   }
   try {
      const value = await axios.post(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/users/login`,
         { email, password },
         config
      )
      localStorage.setItem('UserLoginInLS', JSON.stringify(value.data))
      return value.data
   } catch (error) {
      return error
   }
}

const registerUser = async (name, email, password) => {
   const config = {
      headers: {
         'Content-Type': 'application/json'
      }
   }
   try {
      const value = await axios.post(
         `${process.env.REACT_APP_BACK_ADDRESS}/api/users`,
         { name, email, password },
         config
      )

      let res = loginUser(email, password)
      return res
   } catch (error) {
      return error
   }
}

export { loginUser, registerUser }
