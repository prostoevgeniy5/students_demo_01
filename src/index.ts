// const express = require('express')
import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { videosRouter } from './routes/videos-router'
import { bloggersRouter } from './routes/bloggers-router'
import { postsRouter } from './routes/posts-router'

const app = express()

const port = process.env.PORT || 3000

const bodyparser = bodyParser({})

app.use(bodyparser)

app.use(cors())

app.use('/videos', videosRouter)

app.use('/bloggers', bloggersRouter)

app.use('/posts', postsRouter)

app.get('/', (req: Request , res: Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
