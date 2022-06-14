// const express = require('express')
import express, {Request, Response} from 'express'
const app = express()
const port = process.env.PORT || 3000

const videos = [
  {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
  {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
  {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
  {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
  {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]  

app.get('/', (req: Request , res: Response) => {
   // debugger;
  res.send('Hello World!')
})

app.get('/videos', (req: Request , res: Response) => {
  // debugger;
  
 res.send(videos)
})

app.post('/videos', (req: Request , res: Response) => {
  // debugger;
  const newVideo = { 
    id: +(new Date()),
    title: req.body.title,
    author: "it-incubator,eu"
  }
  videos.push(newVideo)
 res.send(videos)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
