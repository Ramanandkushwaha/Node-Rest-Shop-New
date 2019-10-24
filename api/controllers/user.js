/* eslint-disable no-tabs */
const mongoose = require('mongoose');//
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_get_all = (req, res, next) => {
  User.find()
    .select('name email')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Users: docs.map(doc => {
          return {
            name: doc.name,
            email: doc.email,
          };
        })
      };
      if (docs.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: 'No user found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_signup = (req, res, next) => {
  User.find( {email: req.body.email })
    .exec()
    .then(user => {
  	  if(user.length >= 1){
  	  	return res.status(409).json({
  	  		status: 0,
  	  		message: 'Mail Exists'
  	  	});
  	  } else {
	  	  	bcrypt.hash(req.body.password, 10, (err, hash) => {
          if(err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  status: 1,
                  message: 'User Created'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
  	  }
    });
};

exports.user_login = (req, res, next)=> {
  User.find( {email: req.body.email} )
    .exec()
    .then(user => {
      if(user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result)=> {
        if(err) {
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
        if(result) {
          const token = jwt.sign( {
            email: user[0].email,
            userId: user[0]._id
          },
			    process.env.JWT_KEY,
			    {
			    	expiresIn: '1h'
			    }
          );
          return res.status(401).json({
            message: 'Auth Successful',
            token: token
          });
        }
        res.status(401).json({
          message: 'Auth failed'
        });
      });

    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next)=> {
  User.remove( {_id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        Status: 1,
        message: 'User deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
