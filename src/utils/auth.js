import axios from "axios";
import config from "../config";

const authAxios = axios.create({
  baseURL: config.deps.API_ENDPOINT,
});

export default authAxios;
