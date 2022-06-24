import {Request, Response, Router} from 'express'

let videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
    {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
    {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
    {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
  ] 

  export const videosRouter = Router({})

  videosRouter.get('/', (req: Request , res: Response) => {
    res.status(200).send(videos)
   })
   
   videosRouter.get('/:id', (req: Request , res: Response) => {
     let videoItem = videos.find( item => item.id === +req.params.id )
     if (videoItem) {
       res.send(videoItem);
     } else {
       res.sendStatus(404)
     }
   })
   
   videosRouter.delete('/:id', (req: Request , res: Response) => {
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
   
   videosRouter.post('/', (req: Request , res: Response) => {
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
   
   videosRouter.put('/:id', (req: Request , res: Response) => {
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