export default function authHeader () {
    const common = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
    const token = localStorage.getItem('token')
    if (token) {
      return { Authorization: 'Bearer ' + token, ...common }
    } else {
      return common
    }
  }
  