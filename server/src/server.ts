import dotenv from 'dotenv'
dotenv.config({path: '.env'})
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import colors from 'colors'
import AuthController from './controllers/auth.controller'
import MemberController from './controllers/member.controller'

if (process.env.MONGO_HOST && process.env.SECRET_JWT && process.env.EXPRESS_PORT) {

  const mongoHost = process.env.MONGO_HOST
  const expressPort = process.env.EXPRESS_PORT

  mongoose.connect(mongoHost, {useNewUrlParser: true, useCreateIndex: true})

  const app = express()

  app.listen(expressPort)

  console.log(colors.yellow(`Your backend api listens on port ${expressPort}.`))

  app.use(bodyParser.json())

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept")
    next()
  })

  app.use('/auth', AuthController.router)

  app.use('/member', MemberController.router)

  app.use(express.static(path.resolve('build')))

  app.get('*', (req,res) =>{
    res.sendFile(path.resolve('build/index.html'))
  });

} else {
  console.log(colors.red('You must configure your environment variables in the .env file.'))
}
