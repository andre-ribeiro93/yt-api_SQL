"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const UserRepository_1 = require("../modules/users/repositories/UserRepository");
const login_1 = require("../middleware/login");
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
const userRepository = new UserRepository_1.UserRepository;
userRoutes.post('/sign-up', (req, res) => {
    userRepository.create(req, res);
});
userRoutes.post('/check-user', (req, res) => {
    userRepository.checkUserbyEmail(req, res);
});
userRoutes.post('/sign-in', (req, res) => {
    userRepository.login(req, res);
});
userRoutes.get('/get-user', login_1.login, (req, res) => {
    userRepository.getUser(req, res);
});
