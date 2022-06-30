import {Request, Response, Router} from 'express'
import {videosRepository} from '../repositories/videos-repository' 

  export const videosRouter = Router({})

  videosRouter.get('/', (req: Request , res: Response) => {
    const videos = videosRepository.getVideos()
    res.status(200).send(videos)
   })
   
   videosRouter.get('/:id', (req: Request , res: Response) => {
    //  let videoItem = videos.find( item => item.id === +req.params.id )
    let videoItem = videosRepository.getVideosById(Number(req.params.id))
     if (videoItem) {
       res.send(videoItem);
     } else {
       res.sendStatus(404)
     }
   })
   
   videosRouter.delete('/:id', (req: Request , res: Response) => {
    let isDeleted = videosRepository.deleteVideosById( +req.params.id )
     if(isDeleted) {
       res.send(204)
     } else {
       res.send(404)
     }
   })
   
   videosRouter.post('/', (req: Request , res: Response) => {
     let title = req.body.title 
     if(title === undefined || typeof title !== 'string' || title.trim() === '' || title.length > 40) {
       res.status(400).send({  
         "errorsMessages": [
           {
             "message": "You did not send correct data of title",
             "field": "title"
           }
         ]
       })
       return
     }
     const newVideo = videosRepository.createVideo(req.body.title)
     res.status(201).send(newVideo)
    //  const newVideo = { 
    //    id: +(new Date()),
    //    title: req.body.title,
    //    author: 'it-incubator.eu'
    //  }
   
    //  videos.push(newVideo)
    // res.status(201).send(newVideo)
   })
   
   videosRouter.put('/:id', (req: Request , res: Response) => {
    //  let index: number | null = null
    //  let videoItem = videos.find( (item, ind: number) => {
    //    if(item.id === +req.params.id) {
    //      index = ind
    //    } return item.id === +req.params.id })
    let isUpdated = videosRepository.updateVideosById(+req.params.id, req.body.title)
     if (!isUpdated) {
        res.sendStatus(404)
      
      //  videoItem.title = req.body.title
      //  videoItem.author = 'it-incubator.eu'  
    
     } else {
      let title = req.body.title;
      if(title === undefined || typeof title !== 'string' || title.trim() === '' || title.length > 40) {
        res.status(400).send({
          "errorsMessages": [
            {
              "message": "You did not send correct data of title",
              "field": "title"
            }
          ]
        })
        return
      } else {
        res.sendStatus(204);
      }
     }
   })