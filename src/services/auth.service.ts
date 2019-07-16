import HttpService from './http.service'
import { BehaviorSubject } from 'rxjs'

class AuthService {

  public isConnected$ = new BehaviorSubject<boolean>(false)
  public isConnected: boolean

  constructor() {
    if (this.getToken()) {
      this.isConnected$.next(true)
      this.isConnected = true
    } else {
      this.isConnected = false
    }
  }

  login(username: string, password: string) {
    return new Promise((resolve, reject) => {
      HttpService.request('http://192.168.0.203:8088/auth/login', 'POST', {username, password})
        .then((response) => {
          if (response.token) {
            this.setToken(response.token)
            this.isConnected$.next(true)
            this.isConnected = true
            resolve(true)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  register(username: string, password: string, recaptcha: string) {
    return new Promise((resolve, reject) => {
      HttpService.request('http://192.168.0.203:8088/auth/register',
        'POST', {username, password, 'g-recaptcha-response': recaptcha})

        .then((response) => resolve(response))
        .catch((error) => {
          reject(error)
        })
    })
  }

  logout() {
    this.isConnected$.next(false)
    this.isConnected = true
    localStorage.removeItem('token')
  }

  setToken(token: string) {
    localStorage.setItem('token', token)
  }

  getToken() {
    return localStorage.getItem('token')
  }

}

export default new AuthService()
