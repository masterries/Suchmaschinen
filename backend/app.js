const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const cors = require('cors');
const bodyParser = require('body-parser');
const esb = require('elastic-builder'); //the builder
const { query } = require('express');

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
    let videoRangeRaw = req.query['videoRange']
    let dateRaw = req.query['date']
    let followerRaw = req.query["follower"]
    let filtersRaw = req.query['filter']
    if(by1 == "normal"){
        by1 = "_score"
    }
    
    let filterArray = filtersRaw.split(",");
    let dateRange = dateRaw.split(";");
    let videoRange = videoRangeRaw.split("-");
    let followerRange = followerRaw.split("-");

    
    if(name == ""){
        send(res,"all","title",name,filterArray,dateRange,videoRange,followerRange,order,by1);
    }else{
        send(res,"match","title",name,filterArray,dateRange,videoRange,followerRange,order,by1);
    }


    
   // if(filtersRaw != "" && name != ""){
     //   send(res,searchWithFilter(res,"title",name,order,by1,filterArray));
    //}else if(name == ""){
      //  searchWithOutNameFilter(res,order,by1,filterArray);
    //}else{
      //  searchSortNormal(res,"title",name,order,by1);
    //}



        
      // let requestBody =  searchBasic("title",name)
      // requestBody = searchSort(requestBody,order,by1);
      // sendBody(res,requestBody,true);
      


   
    
  })

  function send(res,queryType,title,name,filterArray,dateRange,videoRange,followerRange,order,by1){

    requestBody = filter(queryType,title,name,filterArray,dateRange,videoRange,followerRange);
    sort(requestBody,order,by1);
    
    client.search({index: "youtubechannel", body: requestBody.toJSON()}).then(results => {
            if(results.hits.total.value ==0&& queryType!="fuzzy"){
                console.log("fuzzy SdsafsaddsadsadsA")
                send(res,"fuzzy",title,name,filterArray,dateRange,videoRange,followerRange,order,by1);
            }else{
                res.send(results.hits.hits);
            }


        
    })
    .catch(err=>{
        console.log(err)
    });
      
  }


  function filter(queryType,title,name,filterArray,dateRange,videoRange,followerRange){

    const body = esb.requestBodySearch()
    typ = 0;
    switch (queryType){
        case "all":
            typ = esb.boolQuery().must([esb.matchAllQuery()]);

        break;

        case "match":
            typ =  esb.boolQuery().must([esb.matchQuery(title, name,)]);

        break;
        case "fuzzy":
            typ =  esb.boolQuery().must([esb.fuzzyQuery(title, name,)]);

        break;
    }


    
    if(videoRange != 0){
        typ.filter(esb.rangeQuery('videos').gte(videoRange[0]).lte(videoRange[1]));
    }
    if(followerRange != 0){
        typ.filter(esb.rangeQuery('followers').gte(followerRange[0]).lte(followerRange[1]));
    }
    if(dateRange[0] != "" && dateRange[1] != ""){
        typ.filter(esb.rangeQuery('join_date').gte(dateRange[0]).lte(dateRange[1]))
    }
    if(filterArray!=0){
        typ.filter(esb.termsQuery("category_id", filterArray))
    }
     a= body.query(typ)
    esb.prettyPrint(a);
    
     return body.query(typ);
     



  }


  function sort(requestBody,order,by1){
      return requestBody.sort(new esb.sort(by1, order));
  }

  function searchAll(){
    return esb.requestBodySearch().query(esb.matchAllQuery());
  }

  

  function searchWithFilter(res,category,name,order,by1,filterArray){
      console.log(filterArray)
      videoRange=[];
    const requestBody = esb.requestBodySearch()
    .query(
      esb.boolQuery()
        .must([
          esb.matchQuery(
            category, name,
          ),
        ])
      .filter(esb.termsQuery("category_id", filterArray))
 //     .filter(esb.rangeQuery('videos').gte(videoRange[0]).lte(videoRange[1]))
    )
    requestBody.sort(new esb.sort(by1, order));


 
       
      
    

    client.search({index: "youtubechannel", body: requestBody.toJSON()}).then(results => {
       
            //console.log(results)
            res.send(results.hits.hits);

        
    })
    .catch(err=>{
        console.log(err)
    });
  }







  function searchSortNormal(res,category,name,order,by1){
    const requestBody = new esb.RequestBodySearch()
      
        requestBody.query(new esb.MatchQuery(category, name)).sort(new esb.sort(by1, order));
          
      
    

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
    requestBody.query(new esb.FuzzyQuery(category, name)).sort(new esb.sort(by1, order));
        
    


    client.search({index: "youtubechannel", body: requestBody.toJSON()}).then(results => {

            console.log(results)
            res.send(results.hits.hits);

        
    })
    .catch(err=>{
        console.log(err)
    });
  }




app.listen(app.get('port'), function() {
    console.log('Your node.js server is running on PORT: ',app.get('port'));
});




/*
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


  function searchAllFilter(filterArray,dateRange,videoRange,followerRange){
     const body = esb.requestBodySearch()
     

     if(videoRange != "" && followerRange!= "" && dateRange[0] != "" && dateRange[1] != "" && filterArray!=0){
        body.query(esb.boolQuery().must([esb.matchAllQuery()])
            .filter(esb.termsQuery("category_id", filterArray))
           .filter(esb.rangeQuery('join_date').gte(dateRange[0]).lte(dateRange[1]))
           .filter(esb.rangeQuery('videos').gte(videoRange[0]).lte(videoRange[1]))
           .filter(esb.rangeQuery('followers').gte(followerRange[0]).lte(followerRange[1]))
          )

     } else if(videoRange != "" && followerRange!= "" && dateRange[0] != "" && dateRange[1] != ""){
         console.log("Cat + Videos + Follower")
        body.query(
            esb.boolQuery()
              .must([
                esb.matchAllQuery()
              ])
           .filter(esb.rangeQuery('join_date').gte(dateRange[0]).lte(dateRange[1]))
           .filter(esb.rangeQuery('videos').gte(videoRange[0]).lte(videoRange[1]))
           .filter(esb.rangeQuery('followers').gte(followerRange[0]).lte(followerRange[1]))
          )
         
     }
     else if(videoRange != "" &&filterArray!=0 && dateRange[0] != "" && dateRange[1] != ""){
         
        body.query(
            esb.boolQuery()
              .must([
                esb.matchAllQuery()
              ])
           .filter(esb.rangeQuery('join_date').gte(dateRange[0]).lte(dateRange[1]))
           .filter(esb.rangeQuery('videos').gte(videoRange[0]).lte(videoRange[1]))
           .filter(esb.termsQuery("category_id", filterArray))
          ) 
         
     }else if(followerRange!= "" &&filterArray!=0 && dateRange[0] != "" && dateRange[1] != ""){
         
        body.query(
            esb.boolQuery()
              .must([
                esb.matchAllQuery()
              ])
           .filter(esb.rangeQuery('join_date').gte(dateRange[0]).lte(dateRange[1]))
           .filter(esb.rangeQuery('followers').gte(followerRange[0]).lte(followerRange[1]))
           .filter(esb.termsQuery("category_id", filterArray))
          ) 
         
     }else if(followerRange!= "" &&filterArray!=0 && videoRange != ""){
         
        body.query(
            esb.boolQuery()
              .must([
                esb.matchAllQuery()
              ])
            .filter(esb.rangeQuery('videos').gte(videoRange[0]).lte(videoRange[1]))
           .filter(esb.rangeQuery('followers').gte(followerRange[0]).lte(followerRange[1]))
           .filter(esb.termsQuery("category_id", filterArray))
          ) 

    }else if(followerRange!= "" &&filterArray!=0 && videoRange != ""){
         
            body.query(
                esb.boolQuery()
                  .must([
                    esb.matchAllQuery()
                  ])
                .filter(esb.rangeQuery('videos').gte(videoRange[0]).lte(videoRange[1]))
               .filter(esb.rangeQuery('followers').gte(followerRange[0]).lte(followerRange[1]))
               .filter(esb.termsQuery("category_id", filterArray))
              ) 
    
        }          
          else{
            body.query(
                esb.boolQuery()
                  .must([
                    esb.matchAllQuery()
                  ])
              )

          }
    esb.prettyPrint(body);
    const a = esb.boolQuery().must([esb.matchAllQuery()]).filter(esb.rangeQuery('videos').gte(videoRange[0]).lte(videoRange[1]));
    a.filter(esb.rangeQuery('followers').gte(followerRange[0]).lte(followerRange[1]));
    body.query(a)
     return body;



    
  }
*/