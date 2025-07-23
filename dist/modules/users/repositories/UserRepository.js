"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    create(req, res) {
        const { name, email, password } = req.body;
        mysql_1.pool.getConnection((err, conn) => {
            // foi utilizado o 'bcrypt' para criptografar a senha do usuário por meio do hash.
            (0, bcrypt_1.hash)(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json(err);
                }
                // abaixo são os parametros de conexão para criação do usuário.
                conn.query(
                // nessa parte de baixo o código está escrito em 'query'.
                'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)', //inserindo no usuário os itens (entre parenteses) com os valores (?).
                [(0, uuid_1.v4)(), name, email, hash], //*uuidv4 = usado para criar o 'id' do usuário / name / email / hash = criptografa a senha.
                (error, results, fields) => {
                    conn.release(); //serve para encerrar a conexão ao final do processo.
                    if (error) {
                        return res.status(400).json(error);
                    }
                    res.status(200).json({ message: 'User created successfully!' });
                });
            });
        });
    }
    checkUserbyEmail(req, res) {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        mysql_1.pool.getConnection((err, conn) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failure!' });
            }
            conn.query('SELECT email, name FROM users WHERE email = ?', [email], (error, results, fields) => {
                conn.release();
                if (error) {
                    return res.status(500).json({ error: 'Database query failure!' });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }
                else {
                    return res.status(200).json({
                        exists: true,
                        user: {
                            name: results[0].name,
                        }
                    });
                }
            });
        });
    }
    login(req, res) {
        const { email, password } = req.body;
        mysql_1.pool.getConnection((err, conn) => {
            // abaixo são os parametros de conexão para os usuários já criados.
            conn.query(
            //nessa parte de baixo o código está escrito em 'query'.
            'SELECT * FROM users WHERE email = ?', //verificando se o e-mail existe na base de dados.
            [email], (error, results, fields) => {
                conn.release(); //serve para encerrar a conexão ao final do processo.
                if (error) {
                    return res.status(400).json({ error: 'Authentication error!' });
                }
                // veficação de segurança adicional.
                if (!results || results.length === 0) {
                    return res.status(401).json({ error: 'User not found!' });
                }
                // foi utilizado 'compare' do 'bcrypt' para verificar se a senha usada no login é igual a que foi cadastrada e criptografada.
                (0, bcrypt_1.compare)(password, results[0].password, (err, result) => {
                    if (err) {
                        return res.status(400).json({ err: 'Authentication error!' });
                    }
                    if (result) {
                        // usando o 'jsonwebtoken' para retornar um token de autenticação para o usuário.
                        const token = (0, jsonwebtoken_1.sign)({
                            id: results[0].user_id,
                            email: results[0].email
                        }, process.env.SECRET, { expiresIn: '1d' });
                        return res.status(200).json({ token: token, message: 'Authentication created successfully!!' });
                    }
                    else {
                        return res.status(401).json({ error: 'Invalid password!' });
                    }
                });
            });
        });
    }
    getUser(req, res) {
        const { email } = req.user;
        if (email) {
            mysql_1.pool.getConnection((err, conn) => {
                // abaixo são os parametros de conexão para os usuários já criados.
                conn.query(
                //nessa parte de baixo o código está escrito em 'query'.
                'SELECT * FROM users WHERE email = ?', //verificando se o e-mail existe na base de dados.
                [email], (error, results, fields) => {
                    conn.release(); //serve para encerrar a conexão ao final do processo.
                    if (error) {
                        return res.status(400).send({
                            error: error,
                            res: null
                        });
                    }
                    return res.status(201).send({
                        user: {
                            name: results[0].name,
                            email: results[0].email,
                            id: results[0].user_id
                        }
                    });
                });
            });
        }
    }
}
exports.UserRepository = UserRepository;
