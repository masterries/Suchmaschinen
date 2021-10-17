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
    


    let name = req.query['q']
    let order = req.query['order']
    let by1 = req.query['by']
        
      // let requestBody =  searchBasic("title",name)
      // requestBody = searchSort(requestBody,order,by1);
      // sendBody(res,requestBody,true);
      
      searchSortNormal(res,"title",name,order,by1);

   
    
  })

  function searchSortNormal(res,category,name,order,by1){
    const requestBody = new esb.RequestBodySearch()
    .query(new esb.MatchQuery(category, name)).sort(new esb.sort(by1, order));

    client.search({index: "youtubechannel", body: requestBody.toJSON()}).then(results => {
        if(results.hits.total.value==0 ){
            searchSortFuzzy(res,category,name,order,by1);
        }else{
            console.log(results)
            res.send(results.hits.hits);

        }
    })
    .catch(err=>{
        console.log(err)
    });






  }


  function searchSortFuzzy(res,category,name,order,by1){
    const requestBody = new esb.RequestBodySearch()
    .query(new esb.FuzzyQuery(category, name)).sort(new esb.sort(by1, order));


    client.search({index: "youtubechannel", body: requestBody.toJSON()}).then(results => {
        if(results.hits.total.value==0 ){
            fuzzySend(res,requestBody);
        }else{
            console.log(results)
            res.send(results.hits.hits);

        }
    })
    .catch(err=>{
        console.log(err)
    });
  }

  function searchVideo(order,room){
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

  function searchBasic(category,name){
    const requestBody = new esb.RequestBodySearch()
            .query(new esb.MatchQuery(category, name));
            return requestBody;
  }

  function searchSort(requestBody,order,by1){
      if(order == "normal"){
          return requestBody;
      }
    const requestBody1 = requestBody.sort(new esb.sort(by1, order));
    return requestBody1;
            
  }


function sendBody(res,requestBody,fuzzySend1){
    client.search({index: "youtubechannel", body: requestBody.toJSON()}).then(results => {
        if(results.hits.total.value==0 && fuzzySend1 == true){
            fuzzySend(res,requestBody);
        }else{
            console.log(results)
            res.send(results.hits.hits);

        }
    })
    .catch(err=>{
        console.log(err)
    });
}

function fuzzySend(res,requestBody){
    console.log(requestBody.getDSL);
    console.log(requestBody.body)
    client.search({index: "youtubechannel",updatedJson}).then(results => {
        
            console.log(results)
            res.send(results.hits.hits);

        
    });

}

function renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }


app.listen(app.get('port'), function() {
    console.log('Your node.js server is running on PORT: ',app.get('port'));
});

