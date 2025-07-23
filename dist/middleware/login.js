"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const login = (req, res, next) => {
    try {
        const decode = (0, jsonwebtoken_1.verify)(req.headers.authorization, process.env.SECRET); //descriptografando o token //
        req.user = decode;
        next(); //serve para dizer que caso o token estaja validado, deve-se dar continuidade no processo.
    }
    catch (error) {
        return res.status(401).json({ message: 'Access denied!' });
    }
};
exports.login = login;
