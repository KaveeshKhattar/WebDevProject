const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let MongoClient = require('mongodb').MongoClient;
const { response } = require('express');
var url = "mongodb://localhost:27017/";

app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.json());


app.get('/test_index.html', (req, res) => {    
    res.sendFile('test_index.html', {root: __dirname});
});

app.post('/taskAdded', (req, res) => {
    //res.json(req.body);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("3D");
        dbo.collection("students").insertOne({
            task: req.body.task,
            dueday: req.body.dueday
        }, 
        function(err, result) {
            if (err) throw err;
            // res.json(result);
            // res.send({ title: 'Task Added' });
            res.send('Task Added');
            db.close();
        });
    });
});

app.get('/seeTasks.html', (req, res) => {
    res.writeHead(200, {"Content-type" : "text/html"});
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("3D");
        dbo.collection("students").find({}).toArray(function(err, docs) {
            if (err) throw err;
            console.log('hi');
            var result = JSON.stringify(docs)            
            res.write('<table style="border: 2px solid black"><tr style="border: 2px solid black"><th style="border: 2px solid black">Task</th><th style="border: 2px solid black">Due on Day</th></tr>')
            
            for(var i in docs){
                var json = JSON.stringify(docs[i]);                
                var jstr = JSON.parse(json);                
                res.write('<tr><td style="border: 2px solid black">' + jstr.task + '</td>' + '<td style="border: 2px solid black">' + jstr.dueday + '</td>');
            }
            res.write('</table>');
            
            db.close();
            res.end();
        });
    });
});

app.post('/:name', (req, res) => {
    //res.json(req.body);

    MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("3D");        
        var ans = await dbo.collection('students').findOne({task: req.body.task})
        console.log(ans);
        if(ans){
            dbo.collection("students").deleteOne({
                task: req.body.task
            }, 
            function(err, result) {
                if (err) throw err;
                // res.json(result);
                // res.send({ title: 'Task Added' });
                res.send('Task Deleted');
                db.close();
            });
        }
        else{
            res.send("Task does not exist");
        }  
    });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port${port}`);
});
