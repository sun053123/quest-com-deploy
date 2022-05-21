import axios from 'axios';

export default function setAuthToken(token) {

    //set axios interceptor
    // axios.interceptors.request.use(config => {
    //     //proxy
    //     config.baseURL = "http://localhost:8000/api/";
    // });

    if (token) {
        // Apply to every request
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // axios.defaults.proxy.port = `${process.env.API_URL}`; // use react proxy instead
    } else {
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
    }
}
