import axios from 'axios';

const instance = axios.create();

instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use((response) => {
    return response;
  }, (error) => {

    if (error.response && error.response.status && error.response.status === 405) {
      sessionStorage.clear();
      window.location = "/";
    }
    else{
        return Promise.reject(error);
    }
  });

export default instance;