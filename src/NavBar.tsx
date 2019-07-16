import React from 'react'
import {FormProps, Nav, Navbar} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import LoginForm from './forms/Login.form'
import AuthService from './services/auth.service'

interface Props {}

interface States {
  isConnected: boolean
}

class NavBar extends React.Component<Props, States> {

  constructor(props: FormProps) {
    super(props)
    this.state = {
      isConnected: false
    }
  }

  componentWillMount() {
    AuthService.isConnected$.subscribe((status) => {
      this.setState({isConnected: status})
    })
  }

  render() {
    const { isConnected } = this.state
    return (
      <div  className='NavBar'>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>RAPTOR REACT</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">Accueil</Nav.Link>
              {!isConnected && (<Nav.Link as={Link} to="/Inscription">Inscription</Nav.Link>)}
            </Nav>
            <LoginForm />
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}

export default NavBar
