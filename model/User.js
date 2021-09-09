var con = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config/global');

const registerUser = (formData, res) => {
    // check email already exist
    var email = formData.email;
    var qur = con.query('SELECT username FROM user WHERE email = ?', email, function (err, rows) {
        if (err) {
            console.log(err);
        }

        var count = rows.length;
        if (count > 0) {
            var msg = 'Email already exists.';
            // res.render('userAdd', { title: 'Add User', msg: msg });
            return res.status(400).json({ errors: [{msg}] });
        } else {
            //console.log(sql);
            let salt, hashed_password;
                bcrypt.genSalt(10).then(function (string) {
                    salt = string;
                    bcrypt.hash(formData.password, salt).then(function (string) {
                        hashed_password = string;

                        var sql = {
                            fullname: formData.fullname,
                            username: formData.username,
                            password: hashed_password,
                            email: formData.email
                        };

                        //console.log(sql);
                        var qur = con.query('INSERT INTO user SET ?', sql, function (err, rows) {
                            if (err) {
                                console.log(err);
                                ret.error = err;
                            }

                            const payload = {
                                user: {
                                  email: formData.email
                                }
                            };

                            jwt.sign(
                                payload,
                                config.jwtSecret,
                                { expiresIn: '5 days' },
                                (err, token) => {
                                  if (err)  { 
                                      throw err;
                                  }
                                  return res.json({ token });                       
                                }
                            );
                        });
                    });
            });
        }
    });
}

// const findUserByEmail = async (email) => {
    // var user;
    // var qur = await con.query('SELECT fullname, username, email FROM user WHERE email = ?', email, function (err, rows) {
    //     if (err) {
    //         console.log(err);
    //         return null;
    //     }
    //     user = rows[0];

    //     // return rows[0];
    // });
    // console.log(user);
    // return user;
// }

// Exclude password
const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        con.query('SELECT fullname, username, email FROM user WHERE email = ?', email, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(rows[0]);
            }
        });
    });
};

// Include password
const findUserByEmail1 = (email) => {
    return new Promise((resolve, reject) => {
        con.query('SELECT fullname, username, email, password FROM user WHERE email = ?', email, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(rows[0]);
            }
        });
    });
};

module.exports = {
    registerUser,
    findUserByEmail,
    findUserByEmail1,
}