"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRoutes = void 0;
const express_1 = require("express");
const VideoRepositories_1 = require("../modules/videos/repositories/VideoRepositories");
const login_1 = require("../middleware/login");
const videoRoutes = (0, express_1.Router)();
exports.videoRoutes = videoRoutes;
const videoRepository = new VideoRepositories_1.VideoRepository;
videoRoutes.post('/create-video', login_1.login, (request, response) => {
    videoRepository.create(request, response);
});
videoRoutes.get('/get-videos', login_1.login, (request, response) => {
    videoRepository.getVideos(request, response);
});
videoRoutes.get('/search', (request, response) => {
    videoRepository.searchVideos(request, response);
});
videoRoutes.delete('/delete-video/:video_id', login_1.login, (request, response) => {
    videoRepository.deleteVideos(request, response);
});
