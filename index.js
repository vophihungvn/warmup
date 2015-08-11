var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').Server(app);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo');

var taskSchema = mongoose.Schema({
    note: String,
    date_create : {
        type: Number, 
        default: (new Date()).getTime()
    },
    isDone: {
        type: Number,
        default: 0
    }
});

var taskModel = mongoose.model('task', taskSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    taskModel.find({},function(err,data)
    {
        if (err) { throw err;};
        res.render('index', {todos: data});
    });

    
});

app.post("/addTask", function(req,res)
{
    var newTask = new taskModel({
        note: req.body.title
    });

    newTask.save(function(err, data)
    {
        if (err) { throw err;}
        else
        {
            res.send(data);
        }
    });
});

app.post("/editTask", function(req,res)
{
    taskModel.findById(req.body._id, function(err,data)
    {
        if (err) { throw err;}
        else
        {
            data.note = req.body.note;
            data.save(function(err, data)
            {
                if (err) { throw err;}
                else
                {
                    res.send(data);
                }
            });
        }
        
    });

    
});

app.post("/deleteTask", function(req,res)
{
    taskModel.findById(req.body._id, function(err,data)
    {
        if (err) { throw err;}
        else
        {
            data.remove(function(err)
            {
                if (err) { throw err;}
                else
                {
                    res.send(200);
                }
            });
        }
    });

    
});

app.post("/changeStatus", function(req,res)
{
    taskModel.findById(req.body._id, function(err,data)
    {
        if (err) { throw err;}
        else
        {
            data.isDone = 1 - req.body.isDone;
            data.save(function(err, data)
            {
                if (err) { throw err;}
                else
                {
                    res.send(data);
                }
            });
        }
        
    });    
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});