
// import db.js

const db = require("./db")

// import jsonwebtoken
const jwt = require('jsonwebtoken')


//    REGISTER

register = (acno, uname, psw) => {

  return db.User.findOne({ acno }).then(user => {
    if (user) {
      return {
        statusCode: 401,
        status: false,
        message: "User Already Exist"
      }
    }
    else {
      const newuser = new db.User({
        acno,
        username: uname,
        password: psw,
        balance: 0,
        transaction: []
      })

      newuser.save()

      return {
        statusCode: 200,
        status: true,
        message: "Registration Success"
      }

    }
  })


}
// LOGIN

login = (acno, psw) => {

  return db.User.findOne({ acno, password: psw }).then(user => {
    if (user) {
      const token = jwt.sign({ currentAcno: acno }, 'secretkey123')
      return {
        statusCode: 200,
        status: true,
        message: "login Success",
        currentAcno:acno,
        currentUser:user.username,
        token
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "lncorrect acno or Password"
      }

    }
  })
}
// DEPOSIT
deposit = (acno, password, amount) => {
  var amnt = parseInt(amount)

  return db.User.findOne({ acno, password }).then(user => {
    if (user) {
      user.balance += amnt
      user.transaction.push({ type: 'CREDIT', amount: amnt })
      user.save()

      return {
        statusCode: 200,
        status: true,
        message: `${user.balance}`
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "incorrect acno or password"
      }
    }
  })
}
// withdraw
withdraw = (acno, password, amount) => {
  var amnt = parseInt(amount)

  return db.User.findOne({ acno, password }).then(user => {
    if (user) {
      if (amnt > user.balance) {
        return {
          statusCode: 401,
          status: false,
          message: "Insufficent Balance "
        }

      }
      else {
        user.balance -= amnt
        user.transaction.push({ type: 'DEBIT', amount: amnt })
        user.save()
        return {
          statusCode: 200,
          status: true,
          message: user.balance
        }
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "Incorrect password or Account Number "
      }
    }
  })
}
// transaction
gettransaction = (acno) => {
  return db.User.findOne({ acno }).then(user => {
    if (user) {
      return {
        statusCode: 200,
        status: true,
        message: user.transaction
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "incorrect Account number"
      }
    }
  })
}

acdelete=(acno)=>{
  return db.User.deleteOne({acno}).then(user=>{
    if(user){
      return {
        statusCode: 200,
        status: true,
        message: "ac Deleted"
      }

    }
    else{
      return {
        statusCode: 401,
        status: false,
        message: "incorrect Account number"
      }
    }
  })
}

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  gettransaction,
  acdelete
} 
