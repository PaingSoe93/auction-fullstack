import axios from "axios";

const API_ENDPOINT = "http://localhost:8000/";

const client = axios.create({
  baseURL: API_ENDPOINT,
});

client.interceptors.request.use((config) => {
  // do something before executing the request
  // For example tag along the bearer access token to request header or set a cookie

  return config;
});

export { client };
