import responseHandler from "./responseHandler";
import axios from "axios";
import { API_BASE_URL } from "../utils/path";

export const login = async (payload) => {
  const result = await axios({
    url: `${API_BASE_URL}/login`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    data: payload,
  });
  let err = responseHandler(result);
  console.log(err);
  return result;
};
