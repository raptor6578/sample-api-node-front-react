import React from 'react'

class Accueil extends React.Component {

  render() {
    return (
      <div className='Accueil'>
        <h2>Accueil</h2>
        <h5>Nous allons tenter de coder les fonctionnalités suivantes:</h5>
        <ul>
          <li>Utilisation de typescript</li>
          <li>Intégration de react-bootstrap</li>
          <li>Système de routage</li>
          <li>Mise en place d'une base de données firebase</li>
          <li>Intégration d'un formulaire d'inscription</li>
          <li>Intégration d'un formulaire de connexion</li>
          <li>Changement d'état du formulaire de connexion en bouton "logout" si nous sommes connecté.</li>
        </ul>
      </div>
    )

  }
}

export default Accueil
