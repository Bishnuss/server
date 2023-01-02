// import cors
const cors=require('cors')

// Import dataService file from Service folder
const dataservice = require('./service/dataService')

// import json webtoken
const jwt = require('jsonwebtoken')

// import Express
const express = require('express')
const { json } = require('express')

// Create app

const app = express()

// connect frontend
app.use(cors({origin:'http://localhost:4200'}))

// To use json datas
app.use(express.json())

// Midleware for verify the token

const jwtmiddleware = (req, res, next) => {
  try {
    const token = req.headers['access-token']
    const data = jwt.verify(token, "secretkey123")
    next()
  }
  catch {
    res.status(422).json({
      statusCode: 422,
      status: false,
      message: "please login"
    })
  }
}

// Requst

// register
app.post('/register', (req, res) => {

  dataservice.register(req.body.acno, req.body.uname, req.body.psw).then(result => {
    res.status(result.statusCode).json(result)

  })

})



// login
app.post('/login', (req, res) => {

  dataservice.login(req.body.acno, req.body.psw).then(result => {
    res.status(result.statusCode).json(result)
  })

})


// deposit
app.post('/deposit', jwtmiddleware, (req, res) => {

  dataservice.deposit(req.body.acno, req.body.psw, req.body.amount).then(result => {
    res.status(result.statusCode).json(result)
  })

})


// withdraw
app.post('/withdraw', jwtmiddleware, (req, res) => {

  dataservice.withdraw(req.body.acno, req.body.psw, req.body.amount).then(result => {
    res.status(result.statusCode).json(result)
  })

})



// transaction history
app.post('/transaction', jwtmiddleware, (req, res) => {

  dataservice.gettransaction(req.body.acno).then(result => {
    res.status(result.statusCode).json(result)
  })
})


// delete

// Get
// app.get('/',(req,res)=>{
//     res.send('GET Method checking.....')
// })

// // post
// app.post('/',(req,res)=>{
//     res.send('POST Method checking......')
// })


// // put
// app.put('/',(req,res)=>{
//     res.send('PUT Method checking')
// })

// // patch
// app.patch('/',(req,res)=>{
//     res.send('PATCH Method checking')
// })

// // delete
app.delete('/deleteacc/:acno',jwtmiddleware,(req,res)=>{
  dataservice.acdelete(req.params.acno).then(result=>{
    res.status(result.statusCode).json(result)
  })
})
// app.delete('/',(req,res)=>{
//     res.send('DELETE Method checking')
// })


// set port
app.listen(3000, () => {
  console.log("server started at prt number 3000");
})