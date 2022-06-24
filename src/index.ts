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
  {"id": 1, "name": "Dmitry Robionek", "youtubeUrl": "https://www.youtube.com/user/ideafoxvideo"},
  {"id": 2, "name": "Dmitry", "youtubeUrl": "https://www.youtube.com/c/ITKAMASUTRA"}
]

let posts = [
  {
    "id": 0,
    "title": "A S Pushkin",
    "shortDescription": "Message for dyadya",
    "content": "Moy dyadya samih chesnih pravil, kogda ne v shutku sanemog, on uvajat sebya sastavil i luchshe vidumat ne smog.",
    "bloggerId": 0,
    "bloggerName": "Mark Solonin"},
  {
    "id": 1,
    "title": "Solomennaya shlyapka",
    "shortDescription": "Libetta, Lizetta, Myuzetta",
    "content": "Либетта, Лизетта, Мюзетта, Жонетта, Жоржетта. Вся жизнь моя вами как солнцем июньским согрета...",
    "bloggerId": 2,
    "bloggerName": "Dmitry"
  },
  {
    "id": 2,
    "title": "T G Shevchenko",
    "shortDescription": "Message for oligarhs",
    "content": "Якби ви знали, паничі, Де люде плачуть живучи, То ви б елегій не творили Та марне Бога б не хвалили",
    "bloggerId": 1,
    "bloggerName": "Dmitry Robionek"
  }
]

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
  } else if (field === 'title') {
    result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 30 ? true : false;
  } else if (field === 'shortDescription') {
    result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 100 ? true : false;
  } else if (field === 'content') {
    result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 1000 ? true : false;
  }  else if (field === 'bloggerId') {
    let blogger = bloggers.find(item => +item.id === +name)
    result = typeof +name !== 'number' || !blogger ? true : false;
  } 
  return result
}

function errorFields():errorsType {
  return {
    errorsMessages: []
  }
}

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
  if (videoItem) {
    let title = req.body.title;
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
    videoItem.title = req.body.title
    videoItem.author = 'it-incubator.eu'  
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
  let bloggerItem = bloggers.find( item => item.id === +req.params.id )
  if (bloggerItem) {
    res.status(200).send(bloggerItem);
  } else {
    res.sendStatus(404)
  }
})

app.delete('/bloggers/:id', (req: Request , res: Response) => {
  let length = bloggers.length
    bloggers = bloggers.filter(item => {
    return item.id !== Number.parseInt(req.params.id)
  })
  if(length > bloggers.length) {
    res.send(204)
  } else if(length === bloggers.length) {
    res.send(404)
  }
})

app.post('/bloggers', (req: Request , res: Response) => {
  const postRequestErrors = errorFields();
  let name = req.body.name 
    if(checkRequestBodyField(name, 'name')) {
    const errorObj = {message: "You did not send correct data", field: "name"}
    postRequestErrors.errorsMessages.push(errorObj)
    }
    if(checkRequestBodyField(req.body.youtubeUrl, 'youtubeUrl')) {
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
  if(checkRequestBodyField(req.body.name, 'name')) {
    const errorObj = {message: "You did not send correct data", field: "name"}
    putRequestErrors.errorsMessages.push(errorObj)
    }
    if(checkRequestBodyField(req.body.youtubeUrl, 'youtubeUrl')) {
      const errorObj = {message: "You did not send correct data", field: "youtubeUrl"}
    putRequestErrors.errorsMessages.push(errorObj)
    }
    if(putRequestErrors.errorsMessages.length > 0) {
      res.status(400).send({putRequestErrors})
      return
    }
  if (bloggerItem) {
    let newBloggers = bloggers.map((item, i) => {
      if(index === i) {
        item.name = req.body.name;
        item.youtubeUrl = req.body.youtubeUrl
      }
      return item
    })
    bloggers = newBloggers;  
    res.sendStatus(204).send('No Content');
  } else {
    res.sendStatus(404)
  }
})
////////////////////////////////////////////////

app.get('/posts', (req, res) => {
  res.status(200).send(posts);
});

app.get('/posts/:id', (req, res) => {
  let postItem = posts.find(item => +item.id === +req.params.id);
  if (postItem) {
    let blogger = checkRequestBodyField(postItem.bloggerId.toString(), 'bloggerId')
    if(!blogger){
      res.status(200).send(postItem);
    } else {
      res.status(400).send('Bad Request')
    }
  } else {
      res.sendStatus(404);
  }
});

app.post('/posts', (req, res) => {
  const postRequestErrors = errorFields();
  if (checkRequestBodyField(req.body.title, 'title')) {
      const errorObj = { message: "You did not send correct data", field: "title" };
      postRequestErrors.errorsMessages.push(errorObj);
  }
  if (checkRequestBodyField(req.body.shortDescription, 'shortDescription')) {
      const errorObj = { message: "You did not send correct data", field: "shortDescription" };
      postRequestErrors.errorsMessages.push(errorObj);
  }
  if(checkRequestBodyField(req.body.content, 'content')) {
      const errorObj = { message: "You did not send correct data", field: "content" };
      postRequestErrors.errorsMessages.push(errorObj);
  }
  if(checkRequestBodyField(req.body.bloggerId, 'bloggerId')) {
    const errorObj = { message: "You did not send correct data", field: "bloggerId" };
    postRequestErrors.errorsMessages.push(errorObj);
}
  if (postRequestErrors.errorsMessages.length > 0) {
      res.status(400).send({ postRequestErrors });
      return;
  }

let blogger = bloggers.find(item => +item.id === +req.body.bloggerId)
let newPost
if(blogger) {
  newPost = {
      id: +(new Date()),
      "title": req.body.title,
      "shortDescription": req.body.shortDescription,
      "content": req.body.content,
      "bloggerId": req.body.bloggerId,
      "bloggerName": blogger.name
  };
  posts.push(newPost);
  res.status(201).send(newPost);
}

});

app.put('/posts/:id', (req, res) => {
  let index: number;
  const putRequestErrors = errorFields();
  let postItem = posts.find((item, ind) => {
      if (item.id === +req.params.id) {
          index = ind;
      }
      return +item.id === +req.params.id;
  });
  if (checkRequestBodyField(req.body.title, 'title')) {
    const errorObj = { message: "You did not send correct data", field: "title" };
    putRequestErrors.errorsMessages.push(errorObj);
}
if (checkRequestBodyField(req.body.shortDescription, 'shortDescription')) {
    const errorObj = { message: "You did not send correct data", field: "shortDescription" };
    putRequestErrors.errorsMessages.push(errorObj);
}
if(checkRequestBodyField(req.body.content, 'content')) {
    const errorObj = { message: "You did not send correct data", field: "content" };
    putRequestErrors.errorsMessages.push(errorObj);
}
if(checkRequestBodyField(req.body.bloggerId, 'bloggerId')) {
    const errorObj = { message: "You did not send correct data", field: "bloggerId" };
    putRequestErrors.errorsMessages.push(errorObj);
}
  if (putRequestErrors.errorsMessages.length > 0) {
      res.status(400).send({ putRequestErrors });
      return;
  }
  if (postItem) {
      posts = posts.map((item, i) => {
          if (index === i) {
              item.title = req.body.title
              item.shortDescription = req.body.shortDescription;
              item.content = req.body.content;
              item.bloggerId = req.body.bloggerId
          }
          return item;
      });
      res.sendStatus(204).send('No Content');
  }
  else {
      res.sendStatus(404);
  }
});

app.delete('/posts/:id', (req, res) => {
  let length = posts.length;
  posts = posts.filter(item => {
      return item.id !== Number.parseInt(req.params.id);
  });
  if (length > posts.length) {
      res.send(204);
  } else {
      res.send(404);
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
