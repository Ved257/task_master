const express = require('express');
const app = express();
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
var Auth = false




var connectionString = 'mongodb+srv://salt57:sourish@cluster0.q4lz6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('users')
    const coresCollection = db.collection('cores')
    const boardCollection = db.collection('boards')
    const tasksCollection = db.collection('tasks')

    app.use(bodyParser.json())
    app.set("view engine","ejs");
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static(__dirname));

    app.get('/', (req, res) => {
        res.render('login')
    })

    // app.get('/corehome', (req, res) => {
    //     res.render('corehomepage')
    // })

    app.post('/signin', (req, res) => {
        // console.log(req.body)
        if(parseInt(req.body.username.slice(0,2)) == 20)
        {
            console.log('core member logged in')
            coresCollection.findOne(req.body)
                .then(results => {
                    if(results)
                    {
                        // console.log(results.username)
                        
                        tasksCollection.findOne({'username': results.username})
                            .then(taskResult => {
                                const taskInfo = {
                                    task: taskResult.task 
                                }

                                res.render('corehomepage', taskInfo)
                            })
                        // tasksCollection.findOne({'username': username},function(err,finditem){
                        //     console.log(finditem)
                        //  })
                        // console.log(taskResult[0])
                        // console.log(JSON.stringify(taskInfo))
                        //  
                    }
                    else
                    {
                        res.redirect('/')
                    }
                })
                .catch(error => console.error(error))
            .catch(error => console.error(error))
        }
        else if(parseInt(req.body.username.slice(0,2)) < 20) 
        {
            console.log('board member logged in')
            boardCollection.findOne(req.body)
                .then(results => {
                    if(results)
                    {
                        tasksCollection.find().toArray()
                            .then(taskResult => {
                                coresCollection.find().toArray()
                                    .then(coreResult => {
                                        const taskInfo = {
                                            tasks: taskResult,
                                            coreMembers: coreResult
                                        }
                                        res.render('boardhomepage', taskInfo)
                                    })
                            })
                    }
                    else
                    {
                        res.redirect('/')
                    }
                })
        }
        else
        {
            res.redirect('/')
        }
        
    })
  })

app.listen(3000, function() {
  console.log('listening on 3000')
})

