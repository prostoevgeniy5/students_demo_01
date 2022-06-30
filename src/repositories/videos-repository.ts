import { videos, Videos } from "./db"

// type Videos = {
//     id: number
//     title: string
//     author: string
// }

export const videosRepository = {
    getVideos():Videos[] {
        return videos
    },
    getVideosById(id: number) {
        let videoItem = videos.find( (item: Videos) => {
            return item.id === id 
        })
        return videoItem
    },
    deleteVideosById(id: number) {
        let ind = null
        videos.forEach((item, index) => {
            if(item.id === id) {
                ind = index
            }
          })
          if (ind) {
            videos.splice(ind, 1)
            return true
          } else {
            return false
          }
    },
    updateVideosById(id: number, title: string) {
     let videoItem = videos.find( (item, ind: number) => {
        return item.id === id })
        if (videoItem) {
            videoItem.title = title
            return true
        } else {
            return false
        }
    },
    createVideo(title: string) {
        const newVideo = { 
            id: +(new Date()),
            title: title,
            author: 'it-incubator.eu'
          }
        
          videos.push(newVideo)
          return newVideo
    }
}