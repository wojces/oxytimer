import axios from 'axios'
import { getToken } from "../utils/utlisToken"
import request from "./request"
import { API_BASE_URL } from '../utils/path'

export const createTable = async (newTable) => {
  const [err, result] = await request({
    url: `${API_BASE_URL}/createTable`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken().token}`,
    },
    data: newTable,
  });
  return result
}

export const getTables = async () => {
  const [err, result] = await request({
    url: `${API_BASE_URL}/getTables`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken().token}`,
    }
  })
  return result
}

export const getSingleTable = async (tableId) => {
  const [err, result] = await request({
    url: `${API_BASE_URL}/getSingleTable/${tableId}`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken().token}`,
    },
  })
  return result
}

export const putFinishTable = async (reqData) => {
  const [err, result] = await request({
    url: `${API_BASE_URL}/finishTable`,
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken().token}`
    },
    data: reqData
  })
  return result
}

export const getPrintTable = async (idTable) => {
  const [err, result] = await request({
    url: `${API_BASE_URL}/printTable/${idTable}`,
    method: "get",
    headers: {
      Authorization: `Bearer ${getToken().token}`
    },
    responseType: 'arraybuffer'
  })
  return result
}

export const putSaveToPdf = async (idTable) => {
  const [err, result] = await request({
    url: `${API_BASE_URL}/saveToPdf/${idTable}`,
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken().token}`
    },
  })
  return result
}

export const updateTable = async (reqTable) => {
  const [err, result] = await request({
    url: `${API_BASE_URL}/updateTable`,
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken().token}`
    },
    data: reqTable,
  })
  return result
}