import Axios from "axios";

const axios = Axios.create({
    baseURL: (import.meta.env.VITE_API_URL_LOCAL ||
        import.meta.env.VITE_API_URL_PROD),
    headers: { Auth: 'Simple AUTH' },
    timeout: 3000
});

export default axios;