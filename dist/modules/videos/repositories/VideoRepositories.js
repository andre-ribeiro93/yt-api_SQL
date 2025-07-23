"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
class VideoRepository {
    create(req, res) {
        const { user_id, title, description, thumbnail, publishedAt } = req.body;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('INSERT INTO videos (video_id, user_id, title, description, thumbnail, publishedAt) VALUES (?,?,?,?,?,?)', [(0, uuid_1.v4)(), user_id, title, description, thumbnail, publishedAt], (error, results, fields) => {
                connection.release();
                if (error) {
                    return res.status(400).json(error);
                }
                res.status(200).json({ message: 'Video added successfully!' });
            });
        });
    }
    getVideos(req, res) {
        const user_id = req.user.id;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('SELECT * FROM videos WHERE user_id = ?', [user_id], (error, results, fields) => {
                connection.release();
                if (error) {
                    return res.status(400).json({ error: 'Failed to get videos!' });
                }
                return res.status(200).json({ message: 'Videos returned successfully!', videos: results });
            });
        });
    }
    searchVideos(req, res) {
        const { search } = req.query;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('SELECT * FROM videos WHERE title LIKE ?', [`%${search}%`], (error, results, fields) => {
                connection.release();
                if (error) {
                    return res.status(400).json({ error: 'Failed to search for videos!' });
                }
                return res.status(200).json({ message: 'Video search completed successfully!', videos: results });
            });
        });
    }
    deleteVideos(req, res) {
        const user_id = req.user.id;
        const { video_id } = req.params;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('DELETE FROM videos WHERE user_id = ? AND video_id = ?', [user_id, video_id], (error) => {
                connection.release();
                if (error) {
                    return res.status(400).json({ error: 'Failed to delete video!' });
                }
                return res.status(200).json({ message: 'Video deleted successfully!' });
            });
        });
    }
}
exports.VideoRepository = VideoRepository;
