import axios from 'axios'
export const Urls = "http://localhost:9020"

const api = axios.create({
    baseURL:Urls
})