import axios from "axios";

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnJvbGxtZW50IjoiMjJBMDcxMDIxN00wMDAxIiwiZXhwIjoxNzMyOTEzOTY1fQ.sEsjl_PxTZVVRy3GxBNd5RrntqxFZMrz-JDOx8lv01w'

const CobachApi = axios.create({
  baseURL: import.meta.env.VITE_COBACH_API_URL,
  headers: {
    Authorization: `Bearer ${apiKey}`
  }
})

//TODO:
export { CobachApi }
