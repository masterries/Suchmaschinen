const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const cors = require('cors');
const bodyParser = require('body-parser');
const esb = require('elastic-builder'); //the builder
const { query } = require('express');

app.set('port', process.env.PORT || 80 );
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
    let countryRaw = req.query['country']
    let size = req.query['treffer'];
    let page = req.query['page'];
    if(by1 == "normal"){
        by1 = "_score"
    }

    //todo  
    let basicInfo = {};
    basicInfo["res"] = res;
    basicInfo["typMatch"] = "";
    basicInfo["searchby"] = "title";
    basicInfo["Index"] = "youtubechannel";
    

    let filter = {};
    filter["category"] = filtersRaw.split(",");
    filter["date"] = dateRaw.split(";");
    filter["video"] = videoRangeRaw.split("-");
    filter["follower"] = followerRaw.split("-");
    filter["country"] = countryRaw.split(",");
    filter["size"] = size;
    filter["page"] = page;


    console.log(page);

    
    if(name == ""){
      //Empty Search 
        send(res,"all","title",name,filter,order,by1,req);
    }else{
      // Search with keayword
        send(res,"match","title",name,filter,order,by1,req);
    }  
    
  })


  //WIP: Temp Suggestion variable 
  sugg ="";



  function send(res,queryType,title0,name,filter,order,by1){
    
    //Building request Body with filter and sorting
    //Printing for logging in Console
    requestBody = filterExc(queryType,title0,name,filter);
    requestBody = sort(requestBody,order,by1);
    esb.prettyPrint(requestBody);
    
    //elasticSearch Send Request to Server and giving response
    client.search({index: "youtubechannel", body: requestBody.toJSON()}).then(results => {

            //if Fuzzy Search always send result back
            if(queryType== "fuzzy"){
              res.send(results.hits.hits);

            }else if(results.hits.total.value ==0){
            //if Normal Match Search is empty then doing a Fuzzy search
               send(res,"fuzzy",title0,name,filter,order,by1);

              //if normal match search giving result, then send this back to the Server
            }else{
              /*if(queryType!="fuzzy"){

              
                let body1 = esb.requestBodySearch();
                body1.query(esb.multiMatchQuery([ "title","title._2gram","title._3gram"],name)).size(1);
                //esb.prettyPrint(body1);

                client.search({
                    index: "youtubechannel_auto",
                    body: body1
                })
                .then(response => {
                    if(response.hits.hits !=0){
                        a = response.hits.hits;
                        sugg  = a[0]._source.title;
                    }

                })

               
                console.log(sugg)
                if(sugg != 0){
                    results.hits.hits[0]._source["Suggestion"] = sugg;
                    console.log(results.hits.hits[0]._source);
                }}*/

                console.log(results)
                console.log("gesendet")
                res.send(results.hits.hits);
            }


        
    })
    .catch(err=>{
        console.log(err)
    });
      
  }

  //simple Filter method
  //in filter is a Array of different kind of filter (<Array>|Term)
  function filterExc(queryType,title,name,filter){

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


    
    if(filter["video"] != 0){
        typ.filter(esb.rangeQuery('videos').gte(filter["video"][0]).lte(filter["video"][1]));
    }
    if(filter["follower"] != 0){
        typ.filter(esb.rangeQuery('followers').gte(filter["follower"][0]).lte(filter["follower"][1]));
    }
    if(filter["date"][0] != "" && filter["date"][1] != ""){
        typ.filter(esb.rangeQuery('join_date').gte(filter["date"][0]).lte(filter["date"][1]))
    }
    if(filter["category"]!=0){
        typ.filter(esb.termsQuery("category_id",filter["category"]))
    }
    if(filter["country"]!=0){

      //if other Trying to invest the List
        var countryArr = filter["country"];
        if(countryArr.includes("Other")){
            var notCountry = [
                "United States",
                "Great-Britain",
                "India",
                "Russian Federation",
                "Canada",
                "Australia",
                "Germany"
              ]
            countryArr = removeItemOnce(countryArr,"Other");
            countryArr.forEach(element =>notCountry = removeItemOnce(notCountry, element));
            console.log(countryArr)
            typ.mustNot(esb.termsQuery("country",notCountry));
        }else{
            typ.filter(esb.termsQuery("country",countryArr))
        }        
    }

    if(filter["size"] !=10 ){
      console.log("sizeing")
      body.size(filter["size"]);
    }
    if(filter["page"] != 1){
      if(filter["page"] >0 ){
        body.from((filter["page"]-1)*filter["size"] );
      }
    }

     a= body.query(typ)

    
     return body.query(typ);
     



  }

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }


  function sort(requestBody,order,by1){
      return requestBody.sort(new esb.sort(by1, order));
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


    
  }
*/