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

let bloggers = [
  {"id": 0, "name": "Mark Solonin", "youtubeUrl": "https://www.youtube.com/channel/UChLpUGaZO35ICTltBP50VSg"}, 
  {"id": 1, "name": "Dmitry Robionek", "youtubeUrl": "https://www.youtube.com/user/ideafoxvideo"}
]

let posts = [
  {
    "id": 0,
    "title": "A S Pushkin",
    "shortDescription": "Message for dyadya",
    "content": "Moy dyadya samih chesnih pravil, kogda ne v shutku sanemog, on uvajat sebya sastavil i luchshe vidumat ne smog.",
    "bloggerId": 0,
    "bloggerName": "Vasya"},
  {
    "id": 1,
    "title": "T G Shevchenko",
    "shortDescription": "Message for oligarhs",
    "content": "Якби ви знали, паничі, Де люде плачуть живучи, То ви б елегій не творили Та марне Бога б не хвалили",
    "bloggerId": 2,
    "bloggerName": "Andriy"
  }
]

const bodyparser = bodyParser({})
app.use(bodyparser)

app.use(cors())

app.get('/', (req: Request , res: Response) => {
  res.send('Hello World!')
})

app.get('/videos', (req: Request , res: Response) => {
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
  let title = req.body.title 
  if(title === undefined || typeof title !== 'string' || title.trim() === '' || title.length > 40) {
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
    let title = req.body.title;
    if(title === undefined || typeof title !== 'string' || title.trim() === '' || title.length > 40) {
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
    videoItem.title = req.body.title
    videoItem.author = 'it-incubator.eu'
    console.log(videoItem)    
    res.sendStatus(204).send(videoItem);
  } else {
    res.sendStatus(404)
  }
})
///////////////////////////////////////////////////////////////

app.get('/bloggers', (req: Request , res: Response) => {
 res.status(200).send(bloggers)
})

app.get('/bloggers/:id', (req: Request , res: Response) => {
  console.log(req.query, 'req.query', req.params, 'req.params')
  let bloggerItem = bloggers.find( item => item.id === +req.params.id )
  if (bloggerItem) {
    res.status(200).send(bloggerItem);
  } else {
    res.sendStatus(404)
  }
})

app.delete('/bloggers/:id', (req: Request , res: Response) => {
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

type errorsDescription = {
  message: string
  field: string
}

interface errorsType {
  errorsMessages: errorsDescription[]
}

function checkRequestBodyField (name: string, field: string): boolean {
  let result = false;
  if(field === 'name'){
    result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 15 ? true : false;
  } else if (field === "youtubeUrl") {
    result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 100 || !/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(name) ? true : false;
  }
  return result
}

function errorFields():errorsType {
  return {
    errorsMessages: []
  }
}

app.post('/bloggers', (req: Request , res: Response) => {
  const postRequestErrors = errorFields();
  console.log(req.body)
  let name = req.body.name 
  // if(name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 40) {
    if(checkRequestBodyField(name, 'name')) {
    // res.status(400).send({  
    //   "errorsMessages": [
    //     {
    //       "message": "You did not send correct data",
    //       "field": "name"
    //     }
    //   ]
    // })
    const errorObj = {message: "You did not send correct data", field: "name"}
    postRequestErrors.errorsMessages.push(errorObj)
    }
    if(checkRequestBodyField(req.body.youtubeUrl, 'youtubeUrl')) {
      // res.status(400).send({  
      //   "errorsMessages": [
      //     {
      //       "message": "You did not send correct data",
      //       "field": "youtubeUrl"
      //     }
      //   ]
      // })
      // return
      const errorObj = {message: "You did not send correct data", field: "youtubeUrl"}
    postRequestErrors.errorsMessages.push(errorObj)
    }
    if(postRequestErrors.errorsMessages.length > 0) {
      res.status(400).send({postRequestErrors})
      return
    }
  const newBlogger = { 
    id: +(new Date()),
    "name": req.body.name,
    "youtubeUrl": req.body.youtubeUrl
  }

  bloggers.push(newBlogger)
 res.status(201).send(newBlogger)
})

app.put('/bloggers/:id', (req: Request , res: Response) => {
  let index: number 
  const putRequestErrors = errorFields();
  let bloggerItem = bloggers.find( (item, ind: number) => {
    if(item.id === +req.params.id) {
      index = ind
    } return item.id === +req.params.id })
  console.log(bloggerItem)
  if(checkRequestBodyField(req.body.name, 'name')) {
    // res.status(400).send({  
    //   "errorsMessages": [
    //     {
    //       "message": "You did not send correct data",
    //       "field": "name"
    //     }
    //   ]
    // })
    const errorObj = {message: "You did not send correct data", field: "name"}
    putRequestErrors.errorsMessages.push(errorObj)
    }
    if(checkRequestBodyField(req.body.youtubeUrl, 'youtubeUrl')) {
      // res.status(400).send({  
      //   "errorsMessages": [
      //     {
      //       "message": "You did not send correct data",
      //       "field": "youtubeUrl"
      //     }
      //   ]
      // })
      // return
      const errorObj = {message: "You did not send correct data", field: "youtubeUrl"}
    putRequestErrors.errorsMessages.push(errorObj)
    }
    if(putRequestErrors.errorsMessages.length > 0) {
      res.status(400).send({putRequestErrors})
      return
    }
  if (bloggerItem) {
    // let title = req.body.title;
    // if(title === undefined || typeof title !== 'string' || title.trim() === '' || title.length > 40) {
    //   console.log(req.body.title)
    //   res.status(400).send({
    //     "errorsMessages": [
    //       {
    //         "message": "You did not send correct data",
    //         "field": "title"
    //       }
    //     ]
    //   })
    //   return
    // }
    let newBloggers = bloggers.map((item, i) => {
      if(index === i) {
        item.name = req.body.name;
        item.youtubeUrl = req.body.youtubeUrl
      }
      return item
    })
    bloggers = newBloggers;
    console.log(bloggers)    
    res.sendStatus(204).send('No Content');
  } else {
    res.sendStatus(404)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
