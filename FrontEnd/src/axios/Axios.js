import axios from "axios"

export default axios.create(
    {
        baseURL:"https://blogappbackend-jcs1.onrender.com"
    }
)