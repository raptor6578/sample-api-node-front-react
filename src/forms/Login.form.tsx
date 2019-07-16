import React, {ChangeEvent, FormEvent} from 'react'
import {Button, Form} from "react-bootstrap";
import AuthService from '../services/auth.service'

interface Props {}

interface States {
  username?: string
  password?: string
  isConnected?: boolean
}

class LoginForm extends React.Component<Props, States> {

  constructor(props: Props) {
    super(props)
    this.state = {username: '', password: '', isConnected: false}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentWillMount() {
    AuthService.isConnected$.subscribe((status) => {
      this.setState({isConnected: status})
    })
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    switch(event.target.name)  {
      case 'username':
        this.setState({username: event.target.value})
        break
      case 'password':
        this.setState({password: event.target.value})
        break
    }
  }

  handleSubmit(event: FormEvent<HTMLFormElement>) {
    const { username, password} = this.state;
    event.preventDefault()
    if (username && password) {
      AuthService.login(username, password)
        .then((response) => {
          if (response) {
            this.setState({isConnected: true})
          }
        })
    }
  }

  logout() {
    AuthService.logout()
    this.setState({isConnected: false})
  }

  render() {
    const { username, password, isConnected } = this.state;
    return (
      <div className="LoginForm">
        { isConnected ? (
          <Button type="submit" onClick={this.logout} variant="outline-success">Déconnexion</Button>
        ) : (
          <Form inline onSubmit={this.handleSubmit}>
            <input type="text" id="username" name="username" value={username} onChange={this.handleChange} required className="form-control mr-sm-2" />
            <input type="password" id="password" name="password" value={password} onChange={this.handleChange} required className="form-control mr-sm-2" />
            <Button type="submit" variant="outline-success">Connexion</Button>
          </Form>
        )}
      </div>
      )
  }

}

export default LoginForm
