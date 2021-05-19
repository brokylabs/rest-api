// Defines Packages
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000
const router = express.Router()

// Model instances
const User = require('./app/models/users')

// Body Parser get data from HTTP Request
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(bodyParser.json())

// Create Connection to MongoDB
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/sample', {
    useNewUrlParser : true,
    useUnifiedTopology : true
})

// API Route
// root routes
router.get('/', function(req, res){
    res.json({
        message : "Welcome to REST API Simple"
    })
})

// Model related routes
// POST : Create User
// GET : Get all users

router.route('/users')
    .post(function(req, res){
        const user = new User();
            user.username = req.body.username
            user.password = req.body.password
            user.name = req.body.name
            user.email = req.body.email
            user.save(function(err){
                if(err) res.send(err);
                else res.json({
                    message : 'New Users Created!'
                });
            });
    })
    .get(function(req, res){
        User.find(function(err, users){
            if(err) res.send(err)
            else res.json(users)
        });
    });

// GET  : get a users
// PUT : Updating user attributes
// DEL : Delete User

router.route('/users/:username')
    .get(function(req, res){
        User.findOne({
            username : req.params.username
        }, function(err, user){
            if(err) res.send(err)
            else res.json(user)
        });
    })
    .put(function(req, res){
        User.findOne({
            username : req.params.username
        }, function(err, user){
            if(err) res.send(err)
            else {
                user.username = req.body.username
                user.password = req.body.password
                user.name = req.body.name
                user.email = req.body.email
                user.save(function(err){
                    if(err) res.send(err)
                    else res.json({
                        message : 'Users Updated!'
                    });
                });
            }
        });
    })
    .delete(function(req, res){
        User.deleteOne({
            username : req.params.username
        }, function(err, user){
            if(err) res.send(err)
            else res.json({
                message : 'User Deleted!!!'
            })
        });
    });


app.use('/api', router); // Prefix for 'router'
app.listen(port); // This service will listen on port defines at point 1
console.log(`Server running on port : ${port}`);