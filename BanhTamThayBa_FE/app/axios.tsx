import axios from "axios"; 
 const API = axios.create({   baseURL: "http://172.20.10.8:8080/api", 
}); delete API.defaults.headers.common["Authorization"]; export default API; 
