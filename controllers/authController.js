const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

// register user
module.exports.registerUser = async function(req, res) {
    try {
        let { email, password, fullname } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) {
            return res.status(401).send("Already have an account");
        }

        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return res.send(err.message);
            }
            bcrypt.hash(password, salt, async function(err, hash) {
                if (err) {
                    return res.send(err.message);
                } else {
                    let newUser = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                    });

                    let token = generateToken(newUser); // we created a separate file to create token
                    res.cookie("token", token);
                    res.send("User created successfully");
                }
            });
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
};

// login user
module.exports.loginUser = async function(req, res) {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email: email });

        if (!user) {
            return res.send("Email or Password Incorrect");
        }

        bcrypt.compare(password, user.password, function(err, result) {
            if (result) {
                let token = generateToken(user);
                res.cookie("token", token);
                res.send("User logged in");
            } else {
                return res.send("Email or Password Incorrect");
            }
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
};

// logout user
module.exports.logoutUser = function(req, res) {
    res.cookie("token", "");
    res.redirect("/");
};
