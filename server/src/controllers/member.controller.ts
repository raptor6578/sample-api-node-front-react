import express from 'express'
import expressJwt from 'express-jwt'
import jwt from "jsonwebtoken";

class MemberController {

  public router: express.Router

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes() {

    if (process.env.SECRET_JWT) {

      const secretJwt = process.env.SECRET_JWT

      this.router.use(expressJwt({secret: secretJwt}),
        (err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) => {

          if (err.name === 'UnauthorizedError') {
            res.status(401)
            res.json({
              error: 'Invalid token.',
              status: 401
            })
          } else {
            next()
          }
        })

      this.router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.headers.authorization) {
          const token = req.headers.authorization.split(' ')[1]
          const decoded: any = jwt.verify(token, secretJwt)
          res.locals.username = decoded.username
        }
        next()
      })

      this.router.get('/test', (req: express.Request, res: express.Response) => {
        res.send(res.locals.username)
      })

    }

  }

}

export default new MemberController()
