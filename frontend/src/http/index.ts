import axios from 'axios'
// import 'dotenv/config'
export const api  = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        'Content-Type': 'application/json'
    }
})