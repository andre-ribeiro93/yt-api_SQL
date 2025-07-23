import { Request, Response } from 'express'
import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';

class VideoRepository {
  create(req: Request, res: Response) {
    const { user_id, title, description, thumbnail, publishedAt } = req.body;
    pool.getConnection((err: any, connection: any) => {
      connection.query(
        'INSERT INTO videos (video_id, user_id, title, description, thumbnail, publishedAt) VALUES (?,?,?,?,?,?)',
        [uuidv4(), user_id, title, description, thumbnail, publishedAt],
        (error: any, results: any, fields: any) => {
          connection.release();
          if (error) {
            return res.status(400).json(error)
          }
          res.status(200).json({ message: 'Video added successfully!' });
        }
      )
    })
  }

  getVideos(req: any, res: Response) {
    const user_id = req.user.id
    pool.getConnection((err: any, connection: any) => {
      connection.query(
        'SELECT * FROM videos WHERE user_id = ?',
        [user_id],
        (error: any, results: any, fields: any) => {
          connection.release();
          if (error) {
            return res.status(400).json({ error: 'Failed to get videos!' })
          }
          return res.status(200).json({ message: 'Videos returned successfully!', videos: results });
        }
      )
    })
  }

  searchVideos(req: Request, res: Response) {
    const { search } = req.query;
    pool.getConnection((err: any, connection: any) => {
      connection.query(
        'SELECT * FROM videos WHERE title LIKE ?',
        [`%${search}%`],
        (error: any, results: any, fields: any) => {
          connection.release();
          if (error) {
            return res.status(400).json({ error: 'Failed to search for videos!' })
          }
          return res.status(200).json({ message: 'Video search completed successfully!', videos: results });
        }
      )
    })
  }

  deleteVideos(req: any, res: Response) {
    const user_id = req.user.id;
    const { video_id } = req.params;
    pool.getConnection((err: any, connection: any) => {
      connection.query(
        'DELETE FROM videos WHERE user_id = ? AND video_id = ?',
        [user_id, video_id],
        (error: any) => {
          connection.release();
          if (error) {
            return res.status(400).json({ error: 'Failed to delete video!' })
          }
          return res.status(200).json({ message: 'Video deleted successfully!' });
        }
      )
    })
  }
}

export { VideoRepository }