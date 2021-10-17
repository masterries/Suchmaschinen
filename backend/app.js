const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const cors = require('cors');
const bodyParser = require('body-parser');
const esb = require('elastic-builder'); //the builder

app.set('port', process.env.PORT || 5050 );
app.use(cors());
app.use(bodyParser.json());

const client = new elasticsearch.Client({
    host: 'http://node-1.hska.io:9200',
    log: 'error'
 });

client.ping({ requestTimeout: 30000 }, function(error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});

app.get('/search', function (req, res){
    


    let room = req.query['q']
    let order = req.query['order']
    let by1 = req.query['by']


    if(by1 == "videos"){
        searchVideo(res,order,room)
      
    }else{

        searchFollowers(res,order,room)
      
    }
   
    
  })

  function searchVideo(res,order,room){
    client.search({
        index: "youtubechannel",
        body: {
                //Variable einsetzen 
            sort: { "videos" : { "order": order } },
            
            query: {
                match: {"title":room}
            }
        }
    })
    .then(results => {
        if(results.hits.total.value==0){
            fuzzyVideo(res,order,room);
        }else{
            console.log(results)
            res.send(results.hits.hits);

        }

 
        
    })
    .catch(err=>{
        console.log(err)
    });
  }

  function searchFollowers(res,order,room){
    const requestBody = new esb.RequestBodySearch()
            .query(new esb.MatchQuery('category_name', 'Music'));
            console.log(requestBody.toJSON())
            client.search({index: "youtubechannel", body: requestBody.toJSON()}).then(results => {
                if(results.hits.total.value==0){
                    fuzzyVideo(res,order,room);
                }else{
                    console.log(results)
                    res.send(results.hits.hits);
        
                }
        
         
                
            })
            .catch(err=>{
                console.log(err)
            });
      
   
  }


  function fuzzyVideo(res,order,room){

    client.search()
   
    client.search({
        index: "youtubechannel",
        body: {
                //Variable einsetzen 
            sort: { "videos" : { "order": order } },
            
            query: {
                fuzzy: {"title":room}
            }
        }
    })
    .then(results => {
        console.log(results)
            res.send(results.hits.hits);
        
    })
    .catch(err=>{
      console.log(err)
      res.send([]);
    });
  }

  function fuzzyFollowers(res,order,room){
    client.search({
        index: "youtubechannel",
        body: {

            sort: { "followers" : { "order": order } },
            
            query: {
                fuzzy: {"title":room}
            }
        }
    })
    .then(results => {
        console.log(results)
            res.send(results.hits.hits);
        
    })
    .catch(err=>{
      console.log(err)
      res.send([]);
    });
  }

app.listen(app.get('port'), function() {
    console.log('Your node.js server is running on PORT: ',app.get('port'));
});

