import axios from "axios"

export const setToken = (token) => {
  localStorage.setItem("accessToken", token)
}

export const removeToken = () => {
  localStorage.removeItem("accessToken");
}

export const getToken = () => {
  const token = localStorage.getItem("accessToken")
  const refreshToken = {
    refreshToken: localStorage.getItem("refreshToken")

  }

  return {
    token: token,
    refresh: async () => {
      let response = null;
      try {
        response = await axios({
          url: "http://localhost:4000/refreshToken",
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          data: refreshToken
        })
      } catch (error) {
        console.log(error)
      }
      if (response) {
        removeToken()
        setToken(response.data.access_token)
        return true
      } else {
        return false
      }

    }
  }
}

export const setRefreshToken = (token) => {
  localStorage.setItem("refreshToken", token)
}

export const removeRefreshToken = () => {
  localStorage.removeItem("refreshToken");
}


