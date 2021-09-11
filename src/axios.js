import Axios from "axios";

const axios = Axios.create({
    baseURL: (process.env.REACT_APP_LOCAL_SERVER || ''),
    headers: { Auth: 'Simple AUTH' },
    timeout: 3000
});

export default axios;