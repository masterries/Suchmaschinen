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
    let countryRaw = req.query['country']
    let size = req.query['treffer'];
    let page = req.query['page'];
    if(by1 == "normal"){
        by1 = "_score"
    }
 


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

  function checkValues(page,size,filter){

    console.log(filter["follower"][0])
    var follower = (isBetween(1,1000000000,filter["follower"][0]))&&(isBetween(1,1000000000,filter["follower"][1]));
    var videos = (isBetween(1,1000000,filter["video"][0]))&&(isBetween(1,1000000,filter["video"][1]));
    var date  = isDate(filter["date"][0])&&isDate(filter["date"][1]);
    var i = (isBetween(1,1000,size))
    return i && follower&&videos&&date;
    
  }

  function isBetween(min, max, input){
    if(!isInt(input)){
      return false;
    }
      if(input > max){
        console.log("max" + input)
        return false;
      }
      if(input< min){
        console.log("min" + input)
        return false;
      }
      return true;

  }


  function isInt(value) {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
  }

  function isDate(date){
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
  }

  

 




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
              console.log(results)
              res.send(results);
              console.log("Fuzzy gesendet")

            }else if(results.hits.total.value ==0){
            //if Normal Match Search is empty then doing a Fuzzy search
               send(res,"fuzzy",title0,name,filter,order,by1);

              //if normal match search giving result, then send this back to the Server
            }else
            {


                console.log(results)
               
                res.send(results);
                console.log("gesendet")
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

    body.agg(esb.valueCountAggregation("total", "category_id"))
    body.agg(esb.termsAggregation("totalCat", "category_id").size(20))

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
    console.log(by1);
      return requestBody.sort(new esb.sort(by1, order));
  }




app.listen(app.get('port'), function() {
    console.log('Your node.js server is running on PORT: ',app.get('port'));
});

