var express = require('express');
var mongoose = require('mongoose');
var Taxi = require('./Model/taxiModel');
var bodyParser = require('body-parser');
var cors  = require('cors');

var db = mongoose.connect("mongodb://taxi:driver@ds151528.mlab.com:51528/calltaxiapi");

var app = express();

app.use(cors());

app.use(bodyParser.json());


var taxiRouter = express.Router();

app.use('/taxies', taxiRouter);

taxiRouter.route('/')
    .get(function (req, res) {
        Taxi.find({}, function (err, taxi) {
        //Taxi.find(function (err, taxi) {
            if (err) {
                res.status(500);
                res.send("Internal Server Error");
            }
            else {
                res.status(200);
                res.send(taxi);
            }

        });
    })
    .post(function (req, res) {

        var taxi = new Taxi(req.body);

        taxi.save(function (err) {

            if (err) {
                res.status(500);
                res.send("Failed");
            }
            else {

                res.status(201);
                res.send(taxi);
            }

        });
    })
    .put(function(req,res){

        let cardata = req.body;
        Taxi.findOne({'carNumber':cardata.carNumber},function(err,taxi){

            if(err){
                res.status(404);
                res.send("Not Found");
            }else{
                taxi.carName = cardata.carName;
                taxi.amountPerHour = cardata.amountPerHour;
                taxi.discountAmount = cardata.discountAmount;

                taxi.save(function(err){

                    if(!err){
                        res.status(200);
                        res.send(taxi);
                    }else{
                        res.status(500);
                        res.send("Failed");
                    }
                })
            }
        })

    }).patch(function(req,res){

        let cardata = req.body;
        Taxi.findOne({'carNumber':cardata.carNumber},function(err,taxi){

            if(!err){
                if(req.body._id){
                    delete req.body._id;
                }

                for(var p in req.body){
                    taxi[p] = req.body[p];
                }

                taxi.save(function(err){
                    if(!err){
                        res.status(200);
                        res.send(taxi);
                    }
                })
            }

        });

    }).delete(function(req,res){

        Taxi.findOne({'carNumber':req.body.carNumber},function(err,taxi){

                taxi.remove(function(err){
                    if(!err){
                        res.status(204);
                        res.send("Removed");
                    }

                })
        });

    });
   /*  .put(function(req,res){

        let cardata = req.body;

        Taxi.find({'carNumber':cardata.carNumber},function(err,taxies){
            if(err){
                res.status(500);
                res.send("Failed");
            }else{

                carName: taxies.carName;
                amountPerHour:taxies.amountPerHour;
                discountAmount:taxies.discountAmount;

                taxies.save(function(err){
                    if(err){
                    res.status(500);
                    res.send("Failed");
            }
            else{
                res.status(201);
                res.send(taxi);
            }
        
                })
            }
        })
 */
        

taxiRouter.route('/calculate')
    .post(function (req, res) {
        let cardata = req.body;
        Taxi.find({ 'carName': cardata.carName }, function (err, taxi) {
            if (err) {
                res.send(err)
            } else {
                
                let sum = parseInt(cardata.noOfHours) * parseInt(taxi[0].amountPerHour);
                console.log(sum);
                res.send({ 'sum': sum });
            }
        })

    })

    taxiRouter.route('/finalPayment')
    .post(function(req,res){
        let cardata = req.body;
        Taxi.find({'carNumber':cardata.carNumber},function(err,taxi){
            if(err){
                res.send(err)
            } else{
                let sum = parseInt(cardata.noOfHours) * parseInt(taxi[0].amountPerHour);
                let finalPayment = sum - parseInt(taxi[0].discountAmount); 
                res.send({'finalPayment':finalPayment});
            }


        })

    })

    /* app.listen(9874, function () {

        console.log("Server is running on port 7777");
    }); */
    
var port = process.env.PORT || 7777
app.listen (port,()=> console.log('Running on localhost:7777'));