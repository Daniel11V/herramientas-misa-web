import Axios from "axios";

const axios = Axios.create({
    baseURL: (process.env.REACT_APP_LOCAL_SERVER ||
        process.env.REACT_APP_SERVER),
    headers: { Auth: 'Simple AUTH' },
    timeout: 5000
});

export default axios;