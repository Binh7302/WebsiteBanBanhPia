const jwt = require('jsonwebtoken');
const clientRedis = require('../middleware/redis');
require('dotenv').config;

//use for web admin
exports.checkLoginAdmin = function (req, res, next) {
    const { session } = req;
    const url = req.originalUrl.toLowerCase();
    if (!session) {
        if (url.includes('login')) {
            next();
        } else {
            return res.redirect('/admin/login');
        }
    } else {
        const { tokenClient } = session;
        if (!tokenClient) {
            if (url.includes('login')) {
                next();
            } else {
                return res.redirect('/admin/login');
            }
        } else {
            clientRedis.get(process.env.TOKEN_LOGIN, (err, data) => {
                if (!data) {
                    if (url.includes('login')) {
                        next();
                    } else {
                        return res.redirect('/admin/login');
                    }
                } else {
                    clientRedis.get(data, (err, token) => {
                        if (!token) {
                            if (url.includes('login')) {
                                next();
                            } else {
                                return res.redirect('/admin/login');
                            }
                        } else {
                            jwt.verify(token, process.env.JWT_ADMIN_KEY, function (err, decoded) {
                                if (err) {
                                    if (url.includes('login')) {
                                        next();
                                    } else {
                                        return res.redirect('/admin/login');
                                    }
                                } else {
                                    if (url.includes('login')) {
                                        return res.redirect('/admin/product');
                                    } else {
                                        next();
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}