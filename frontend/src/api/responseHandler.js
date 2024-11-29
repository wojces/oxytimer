export default (response) => {
  // console.log(response)
  // console.log(response?.response)
  if (
    (response && !response.response) &&
    (response.status >= 200 && response.status < 300)
    || (response && response.response) && (response.response.status >= 200 && response.response.status < 300)
  ) return { code: "OK" }
  if ((response && !response.response) && (response.status === 403) ||
    (response && response.response) && (response.response.status === 403)
  ) return {
    code: "tryRefreshToken",
  }
  if (
    (response && !response.response) && (response.status >= 300 && response.status < 401) || (response && response.response) && (response.response.status >= 300 && response.response.status < 401))
    return {
      code: 'ER',
      reason: ''
    }
}