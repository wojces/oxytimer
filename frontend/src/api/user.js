import axios from "axios";
import { getToken } from "../utils/utlisToken";
import request from "./request";
import { API_BASE_URL } from "../utils/path";

export const getUser = async () => {
  const [err, result] = await request({
    url: `${API_BASE_URL}/getUser`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken().token}`
    }
  })
  return result
}

export const changeUserPassword = async (password) => {
  const result = await axios({
    url: `${API_BASE_URL}/changeUserPassword`,
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken().token}`,
    },
    data: password,
  });
  return result
}