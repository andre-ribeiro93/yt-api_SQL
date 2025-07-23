import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'express';

class UserRepository {

  create(req: Request, res: Response) {
    const { name, email, password } = req.body;
    pool.getConnection((err: any, conn: any) => {
      // foi utilizado o 'bcrypt' para criptografar a senha do usuário por meio do hash.
      hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json(err)
        }

        // abaixo são os parametros de conexão para criação do usuário.
        conn.query(
          // nessa parte de baixo o código está escrito em 'query'.
          'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)', //inserindo no usuário os itens (entre parenteses) com os valores (?).
          [uuidv4(), name, email, hash], //*uuidv4 = usado para criar o 'id' do usuário / name / email / hash = criptografa a senha.
          (error: any, results: any, fields: any) => {
            conn.release(); //serve para encerrar a conexão ao final do processo.
            if (error) {
              return res.status(400).json(error)
            }
            res.status(200).json({ message: 'User created successfully!' });
          }
        )
      })
    })
  }


  checkUserbyEmail(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    pool.getConnection((err: any, conn: any) => {

      if (err) {
        return res.status(500).json({ error: 'Database connection failure!' })
      }

      conn.query(
        'SELECT email, name FROM users WHERE email = ?',
        [email],
        (error: any, results: any, fields: any) => {
          conn.release()
          if (error) {
            return res.status(500).json({ error: 'Database query failure!' });
          }

          if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
          } else {
            return res.status(200).json({
              exists: true,
              user: {
                name: results[0].name,
              }
            })
          }
        }
      )
    })
  }


  login(req: Request, res: Response) {
    const { email, password } = req.body;
    pool.getConnection((err: any, conn: any) => {

      // abaixo são os parametros de conexão para os usuários já criados.
      conn.query(
        //nessa parte de baixo o código está escrito em 'query'.
        'SELECT * FROM users WHERE email = ?', //verificando se o e-mail existe na base de dados.
        [email],
        (error: any, results: any, fields: any) => {
          conn.release(); //serve para encerrar a conexão ao final do processo.

          if (error) {
            return res.status(400).json({ error: 'Authentication error!' })
          }

          // veficação de segurança adicional.
          if (!results || results.length === 0) {
            return res.status(401).json({ error: 'User not found!' })
          }

          // foi utilizado 'compare' do 'bcrypt' para verificar se a senha usada no login é igual a que foi cadastrada e criptografada.
          compare(password, results[0].password, (err, result) => {
            if (err) {
              return res.status(400).json({ err: 'Authentication error!' })
            }

            if (result) {
              // usando o 'jsonwebtoken' para retornar um token de autenticação para o usuário.
              const token = sign({
                id: results[0].user_id,
                email: results[0].email
              }, process.env.SECRET as string, { expiresIn: '1d' })

              return res.status(200).json({ token: token, message: 'Authentication created successfully!!' });
            } else {
              return res.status(401).json({ error: 'Invalid password!' });
            }
          })
        }
      )
    })
  }


  getUser(req: any, res: any) {
    const { email } = req.user

    if (email) {
      pool.getConnection((err: any, conn: any) => {

        // abaixo são os parametros de conexão para os usuários já criados.
        conn.query(
          //nessa parte de baixo o código está escrito em 'query'.
          'SELECT * FROM users WHERE email = ?', //verificando se o e-mail existe na base de dados.
          [email],
          (error: any, results: any, fields: any) => {
            conn.release(); //serve para encerrar a conexão ao final do processo.
            if (error) {
              return res.status(400).send({
                error: error,
                res: null
              })
            }

            return res.status(201).send({
              user: {
                name: results[0].name,
                email: results[0].email,
                id: results[0].user_id
              }
            })
          }
        )
      })
    }
  }

}

export { UserRepository };