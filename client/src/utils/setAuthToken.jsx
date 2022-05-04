import axios from 'axios';

export default function setAuthToken(token) {
    if (token) {
        // Apply to every request
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // axios.defaults.proxy.port = `${process.env.API_URL}`; // use react proxy instead
        // console.log(token);
    } else {
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
    }
}
