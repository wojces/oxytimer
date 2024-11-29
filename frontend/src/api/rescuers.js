import axios from 'axios'
import { getToken } from "../utils/utlisToken"
import request from "./request"
import { API_BASE_URL } from '../utils/path'

export const createRescuer = async (rescuer) => {
  const result = await axios({
    url: `${API_BASE_URL}/createRescuer`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken().token}`,
    },
    data: rescuer,
  });
  return result
}

export const getRescuers = async () => {
  const [err, result] = await request({
    url: `${API_BASE_URL}/getRescuers`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken().token}`
    },
  })
  return result
}

export const editRescuer = async (rescuerId, rescuer) => {
  const result = await axios({
    url: `${API_BASE_URL}/editRescuer/${rescuerId}`,
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken().token}`,
    },
    data: rescuer,
  });
  return result
}

export const deleteRescuer = async (rescuerId) => {
  const result = await axios({
    url: `${API_BASE_URL}/deleteRescuer/${rescuerId}`,
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken().token}`,
    },
  });
  return result
}

