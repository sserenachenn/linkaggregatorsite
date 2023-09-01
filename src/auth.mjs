import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// assumes that User was registered in `./db.mjs`
const User = mongoose.model('User');

const startAuthenticatedSession = (req, user, cb) => {
  // TODO: implement startAuthenticatedSession
  req.session.regenerate((err) => {
    if(!err){
      req.session.user = user;
    }
    else{
      console.log(err);
    }
    cb(err);
  });
};

const endAuthenticatedSession = (req, cb) => {
  // TODO: implement endAuthenticatedSession
  req.session.destroy((err) => {
    cb(err);
  });
};


const register = (username, email, password, errorCallback, successCallback) => {
  // TODO: implement register
  if(username.length >= 8 && password.length >= 8){
    User.find({username: username}, (err, users, count) => {
      if(!err && count === undefined && users.length === 0){
        bcrypt.hash(password, 10, (err, hash) => {
          if(!err){
            const user = new User({
              username: username,
              email: email,
              password: hash
            });
            user.save((err, savedUser) =>{
              if(!err){
                successCallback(savedUser);
              }
              else{
                errorCallback({message: 'DOCUMENT SAVE ERROR '+ err});
              }
            });
          }
        });
      }
      else{
        errorCallback({message: 'USERNAME ALREADY EXISTS'});
      }
    });
  }
  else{
    errorCallback({message: 'USERNAME PASSWORD TOO SHORTå'});
  }
};

const login = (username, password, errorCallback, successCallback) => {
  // TODO: implement login
  User.findOne({username:username}, (err, user) => {
    if(!err && user) {
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if(passwordMatch === true){
          successCallback(user);
        }
        else {
          errorCallback({message:'PASSWORDS DO NOT MATCH'});
        }
      });
      
    }
    else {
      errorCallback({message:'USER NOT FOUND'});
    }
  });
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = authRequiredPaths => {
  return (req, res, next) => {
    if(authRequiredPaths.includes(req.path)) {
      if(!req.session.user) {
        res.redirect('/login'); 
      } else {
        next(); 
      }
    } else {
      next(); 
    }
  };
};


export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login,
  authRequired
};
