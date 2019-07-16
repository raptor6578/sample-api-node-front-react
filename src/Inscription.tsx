import React, {ChangeEvent, FormEvent} from 'react'
import {Alert, Button} from 'react-bootstrap'
import ReCAPTCHA from 'react-google-recaptcha'
import AuthService from './services/auth.service'

interface Props {}

interface States {
  username?: string
  password?: string
  confirmPassword?: string
  recaptcha: string,
  alert?: 'success' | 'danger' | ''
  message?: string,
}

class Inscription extends React.Component<Props, States>{

  constructor(props: Props) {
    super(props)
    this.state = {username: '', password: '', recaptcha: '', confirmPassword: '', alert: '', message: ''}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    switch(event.target.name)  {
      case 'username':
        this.setState({username: event.target.value})
        break
      case 'password':
        this.setState({password: event.target.value})
        break
      case 'confirmPassword':
        this.setState({confirmPassword: event.target.value})
        break
    }
  }

  handleChangeRecaptcha(recaptcha: string | null) {
    if (recaptcha) {
      this.setState({recaptcha})
    }
  }

  handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (this.state.username && this.state.password && this.state.confirmPassword) {
      if (this.state.password === this.state.confirmPassword) {
        if (this.state.recaptcha) {
          AuthService.register(this.state.username, this.state.password, this.state.recaptcha)
            .then((response: any) => {
              switch (Number(response.statusCode)) {
                case 201:
                  this.setState({
                    alert: 'success',
                    message: 'Votre inscription a bien été enregistrée.'
                  })
                  break
                case 409:
                  switch (Number(response.errorCode)) {
                    case 3:
                      this.setState({
                        alert: 'danger',
                        message: 'Le pseudonyme que vous avez entré semble déjà présent dans notre base de données'
                      })
                  }
              }
            })
            .catch((error) => {
              this.setState({
                alert: 'danger',
                message: 'Une erreur serveur est survenue.'
              })
              console.log(error)
            })
          // @ts-ignore
          window.grecaptcha.reset()
        } else {
          this.setState({
            alert: 'danger',
            message: 'La vérification captcha a échouée veuillez ressayer.'
          })
        }
      } else {
        this.setState({
          alert: 'danger',
          message: 'Veuillez faire correspondre les mots de passe.'
        })
      }
    } else {
      this.setState({
        alert: 'danger',
        message: 'Veuillez remplir le formulaire dans son intégralité.'
      })
    }

  }

  render() {
    const {username, password, confirmPassword, alert, message} = this.state
    return (
      <div className='Inscription'>
        <h3>Inscription</h3>
        <br />
        { alert && (
          <Alert variant={alert}>
          {message}
          </Alert>
        )}
        <form className="form-group" onSubmit={this.handleSubmit}>
          <label htmlFor="username">Votre pseudonyme:</label>
          <input type="text" id="username" name="username" value={username} onChange={this.handleChange} className="form-control" />
          <label htmlFor="password">Entrez un mot de passe:</label>
          <input type="password" id="password" name="password" value={password} onChange={this.handleChange} className="form-control" />
          <label htmlFor="password">Confirmez votre mot de passe:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={this.handleChange} className="form-control" />
          <br />
          <ReCAPTCHA
            sitekey="6Ldrza0UAAAAACzLy_r7eODDAhSCgAmskCuWprTm"
            onChange={(recaptcha) => this.handleChangeRecaptcha(recaptcha)}
          />
          <br />
          <Button type="submit" variant="outline-success">Envoyer</Button>
        </form>
      </div>
    )
  }
}

export default Inscription
