import responseHandler from "./responseHandler"
import axios from 'axios'
import { getToken, removeRefreshToken, removeToken } from "../utils/utlisToken";

export default async (reqData) => {

  let result;
  try {
    result = await axios(reqData);
  } catch (e) {
    result = e;
  }

  let err = responseHandler(result);

  if (err?.code === "tryRefreshToken") {
    const token = getToken();
    let didTokenRefresh = await token.refresh();

    if (!didTokenRefresh) {
      removeToken()
      removeRefreshToken()
      location.reload()
    }

    const refreshToken = getToken();

    let result2;
    try {
      reqData.headers['Authorization'] = `Bearer ${refreshToken.token}`;
      result2 = await axios(reqData);

    } catch (e) {
      result2 = e
    }
    let err2 = responseHandler(result2);
    return [err2, result2];

  } else {
    return [err, result];
  }
} 