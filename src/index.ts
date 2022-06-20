// const express = require('express')
import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000

let videos = [
  {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
  {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
  {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
  {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
  {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]  

const bodyparser = bodyParser({})
app.use(bodyparser)

app.use(cors())

app.get('/', (req: Request , res: Response) => {
  res.send('Hello World!')
})

app.get('/videos', (req: Request , res: Response) => {
  console.log(req.query, 'req.query', req.params, 'req.params')
 res.status(200).send(videos)
})

app.get('/videos/:id', (req: Request , res: Response) => {
  console.log(req.query, 'req.query', req.params, 'req.params')
  let videoItem = videos.find( item => item.id === +req.params.id )
  if (videoItem) {
    res.send(videoItem);
  } else {
    res.sendStatus(404)
  }
})

app.delete('/videos/:id', (req: Request , res: Response) => {
    const newVideos = videos.filter(item => {
    return item.id !== Number.parseInt(req.params.id)
  })
  if(videos.length > newVideos.length) {
    videos = newVideos;
    res.send(204)
  } else if(videos.length === newVideos.length) {
    res.send(404)
  }
})

app.post('/videos', (req: Request , res: Response) => {
  console.log(req.body)
  if(req.body.title === undefined || req.body.title.trim() === '') {
    console.log(req.body.title)
    res.status(400).send({
      "errorsMessages": [
        {
          "message": "You did not send correct data",
          "field": "title"
        }
      ]
    })
    return
  }
  const newVideo = { 
    id: +(new Date()),
    title: req.body.title,
    author: 'it-incubator.eu'
  }

  videos.push(newVideo)
 res.status(201).send(newVideo)
})

app.put('/videos/:id', (req: Request , res: Response) => {
  let index: number | null = null
  let videoItem = videos.find( (item, ind: number) => {
    if(item.id === +req.params.id) {
      index = ind
    } return item.id === +req.params.id })
  console.log(videoItem)
  if (videoItem) {
    if(req.body.title === undefined || req.body.title.trim() === '') {
      console.log(req.body.title)
      res.sendStatus(400)
      res.send({
        "errorsMessages": [
          {
            "message": "You did not send correct data",
            "field": "title"
          }
        ]
      })
      return
    }
    videoItem.title = req.body.title
    videoItem.author = 'it-incubator.eu'
    console.log(videoItem)    
    res.sendStatus(204).send(videoItem);
  } else {
    res.sendStatus(404)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
