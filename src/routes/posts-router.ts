import {Request, Response, Router} from 'express'
import {bloggers} from './bloggers-router'

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

export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(posts);
  });
  
  postsRouter.get('/:id', (req: Request, res: Response) => {
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
  
  postsRouter.post('/', (req: Request, res: Response) => {
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
        res.status(400).send(postRequestErrors);
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
  
  postsRouter.put('/:id', (req: Request, res: Response) => {
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
        res.status(400).send(putRequestErrors);
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
  
  postsRouter.delete('/:id', (req: Request, res: Response) => {
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
  