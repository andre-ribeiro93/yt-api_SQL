import { Router } from "express";
import { VideoRepository } from "../modules/videos/repositories/VideoRepositories";
import { login } from "../middleware/login";


const videoRoutes = Router();
const videoRepository = new VideoRepository;

videoRoutes.post('/create-video', login, (request, response) => {
  videoRepository.create(request, response);
})

videoRoutes.get('/get-videos', login, (request, response) => {
  videoRepository.getVideos(request, response);
})

videoRoutes.get('/search', (request, response) => {
  videoRepository.searchVideos(request, response);
})

videoRoutes.delete('/delete-video/:video_id', login, (request, response) => {
  videoRepository.deleteVideos(request, response);
})

export { videoRoutes };