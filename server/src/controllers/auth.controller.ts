import express from 'express'
import Member from '../models/member.model'
import * as mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import {RecaptchaV2} from 'express-recaptcha/dist';

class AuthController {

  public router: express.Router
  private recaptcha: RecaptchaV2

  constructor() {
    this.router = express.Router()
    // @ts-ignore
    this.recaptcha = new RecaptchaV2(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_PRIVATE_KEY)
    this.initializeRoutes()
  }

  private initializeRoutes() {

    this.router.post('/register', this.recaptcha.middleware.verify,
      (req: express.Request, res: express.Response) => {

      if (req.body.username && req.body.password && req.recaptcha) {
        if (!req.recaptcha.error) {
          Member.findOne({username: req.body.username}).then((result) => {
            if (!result) {
              const member: any = new Member()
              member.username = req.body.username
              member.password = req.body.password
              member.save()
                .then(() => {
                  res.status(201)
                  res.json({
                    message: 'Successful registration.',
                    statusCode: 201
                  })
                })
                .catch((error: mongoose.Error) => {
                  console.log(error)
                })
            } else {
              res.status(409)
              res.json({
                error: 'Username already exists.',
                errorCode: 3,
                statusCode: 409
              })
            }
          })
        } else {
          res.status(409)
          res.json({
            error: req.recaptcha.error,
            errorCode: 2,
            statusCode: 409
          })
        }
      } else {
        res.status(409)
        res.json({
          error: 'Username and password required.',
          errorCode: 1,
          statusCode: 409
        })
      }
    })

    this.router.post('/login', (req: express.Request, res: express.Response) => {
      if (req.body.username && req.body.password) {
        Member.findOne({username: req.body.username})
          .then((username: any) => {
            if (username) {
              username.comparePassword(req.body.password, (err: any, isMatch: any) => {
                if (isMatch && !err) {
                  // @ts-ignore
                  const token = jwt.sign(username.toJSON(), process.env.SECRET_JWT);
                  res.status(200)
                  res.json({
                    token: token,
                    statusCode: 200
                  });
                } else {
                  res.status(401)
                  res.json({
                    error: 'Bad password.',
                    errorCode: 3,
                    statusCode: 401
                  })
                }
              })
            } else {
              res.status(401)
              res.json({
                error: 'Username not found.',
                errorCode: 2,
                statusCode: 401
              })
            }
          })
          .catch((error: mongoose.Error) => {
            console.log(error)
          })
      } else {
        res.status(401)
        res.json({
          error: 'Username and password required.',
          errorCode: 1,
          statusCode: 401
        })
      }
    })

  }
}

export default new AuthController()
