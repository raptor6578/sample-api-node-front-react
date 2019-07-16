import React from 'react'
import './App.css'
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Accueil from './Accueil'
import Inscription from './Inscription'
import NavBar from './NavBar'

class App extends React.Component {

  render() {
    return (
      <Router>
        <NavBar />
        <Container>
          <Route exact path="/" component={Accueil} />
          <Route path="/inscription" component={() => <Inscription />} />
        </Container>
      </Router>
    )
  }
}

export default App
