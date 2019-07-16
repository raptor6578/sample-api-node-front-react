import AuthService from './auth.service'

class http {

  request(url: string, method: string, body?: any) {

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (AuthService.isConnected) {
      headers['Authorization'] = `Bearer ${AuthService.getToken()}`
    }

    const options: RequestInit = {
      method,
      mode: 'cors',
      headers
    }

    if (body) {
      body = JSON.stringify(body)
      options.body = body;
    }

    const request = new Request(url, options)
    return fetch(request)
      .then(response => response.json())
  }

}

export default new http()
