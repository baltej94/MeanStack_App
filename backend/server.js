////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/27/2019



////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//////////////////////              SETUP NEEDED                ////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

//  Install Nodejs (the bundle includes the npm) from the following website:
//      https://nodejs.org/en/download/


//  Before you start nodejs make sure you install from the
//  command line window/terminal the following packages:
//      1. npm install express
//      2. npm install pg
//      3. npm install pg-format
//      4. npm install moment --save
//      5. npm install elasticsearch


//  Read the docs for the following packages:
//      1. https://node-postgres.com/
//      2.  result API:
//              https://node-postgres.com/api/result
//      3. Nearest Neighbor Search
//              https://postgis.net/workshops/postgis-intro/knn.html
//      4. https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/quick-start.html
//      5. https://momentjs.com/
//      6. http://momentjs.com/docs/#/displaying/format/


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


const express = require('express');
var cors = require('cors');

var pg = require('pg');

var bodyParser = require('body-parser');

const moment = require('moment');


// Connect to elasticsearch Server

const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
});


// Connect to PostgreSQL server
//use default user name as postgres for the below

var conString = "pg://postgres:root@127.0.0.1:5432/chicago_divvy_stations_status";
//var pg_connection_divvy_trips = "pg://postgres:root@127.0.0.1:5432/chicago_divvy_trips";



var pgClient = new pg.Client(conString);
pgClient.connect();

//var pgClientForDivvyTrips = new pg.Client(pg_connection_divvy_trips);
//pgClientForDivvyTrips.connect();



const app = express();
const router = express.Router();

app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

router.all('*', function(req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

var Users = require('./Users')

app.use('/users', Users)



var places_found = [];
var stations_found = [];
var docks_found = [];
var all_docks_found = [];

var place_selected;
var station_selected;
var allRecords = [];
var isBeginningOfTimeRangeSet = false;

var go_back_in_time_var;
var go_forward_in_time_var;
var time_stamp_var_0;
var time_stamp_var_1;
var time_stamp_var_2;
var time_stamp_var_3;
var time_stamp_var_4;



const PAST_HOUR = 'Past Hour';
const PAST_24_HOURS = 'Last 24 Hours';
const PAST_7_DAYS = 'Last 7 Days';

const SUNDAY = 0;
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;




var dailyTrips = [];



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

//////   The following are the routes received from NG/Browser client        ////////

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



router.route('/places').get((req, res) => {

    res.json(places_found)

});



router.route('/place_selected').get((req, res) => {

    res.json(place_selected)

});

router.route('/station_selected').get((req, res) => {

    res.json(station_selected)

});



router.route('/allPlaces').get((req, res) => {

    res.json(places_found)

});




router.route('/stations').get((req, res) => {

    res.json(stations_found)

});



router.route('/places/find').post((req, res) => {

    var str = JSON.stringify(req.body, null, 4);


    find_places_from_yelp(req.body.find, req.body.where).then(function(response) {
        var hits = response;
        res.json(places_found);
    });

});




router.route('/stations/find').post((req, res) => {

    var str = JSON.stringify(req.body, null, 4);

    for (var i = 0, len = places_found.length; i < len; i++) {

        if (places_found[i].name === req.body.placeName) { // strict equality test

            place_selected = places_found[i];

            break;
        }
    }

    const query = {
        // give the query a unique name
        name: 'fetch-divvy',
        text: ' SELECT * FROM divvy_stations_realtime_status ORDER BY (divvy_stations_realtime_status.where_is <-> ST_POINT($1,$2)) LIMIT 3',
        values: [place_selected.latitude, place_selected.longitude]
    }

    find_stations_from_divvy(query).then(function(response) {
        var hits = response;
        res.json({ 'stations_found': 'Successfully Retrieved' });
    });


});



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

////////////////////    Divvy - PostgreSQL - Client API            /////////////////

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


async function find_stations_from_divvy(query) {
    const response = await pgClient.query(query);

    stations_found = [];

    for (i = 0; i < 3; i++) {

        plainTextDateTime = moment(response.rows[i].lastcommunicationtime).format('YYYY-MM-DD, h:mm:ss a');


        var station = {
            "id": response.rows[i].id,
            "stationName": response.rows[i].stationname,
            "availableBikes": response.rows[i].availablebikes,
            "availableDocks": response.rows[i].availabledocks,
            "is_renting": response.rows[i].is_renting,
            "lastCommunicationTime": plainTextDateTime,
            "latitude": response.rows[i].latitude,
            "longitude": response.rows[i].longitude,
            "status": response.rows[i].status,
            "totalDocks": response.rows[i].totaldocks
        };

        stations_found.push(station);

    }


}



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

////////////////////    Yelp - ElasticSerch - Client API            /////////////////

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



async function find_places_from_yelp(place, where) {

    places_found = [];

    //////////////////////////////////////////////////////////////////////////////////////
    // Using the business name to search for businesses will leead to incomplete results
    // better to search using categorisa/alias and title associated with the business name
    // For example one of the famous places in chicago for HotDogs is Portillos
    // However, it also offers Salad and burgers
    // Here is an example of a busness review from Yelp for Pertilos
    //               alias': 'portillos-hot-dogs-chicago-4',
    //              'categories': [{'alias': 'hotdog', 'title': 'Hot Dogs'},
    //                             {'alias': 'salad', 'title': 'Salad'},
    //                             {'alias': 'burgers', 'title': 'Burgers'}],
    //              'name': "Portillo's Hot Dogs",
    //////////////////////////////////////////////////////////////////////////////////////


    let body = {
        size: 1000,
        from: 0,
        "query": {
            "bool": {
                "must": {
                    "term": { "categories.alias": place }
                },


                "filter": {
                    "term": { "location.address1": where }
                },


                "must_not": {
                    "range": {
                        "rating": { "lte": 3 }
                    }
                },

                "must_not": {
                    "range": {
                        "review_count": { "lte": 500 }
                    }
                },

                "should": [
                    { "term": { "is_closed": "false" } }
                ],
            }
        }
    }


    results = await esClient.search({ index: 'chicago_yelp_reviews', body: body });
    console.log(results)
    results.hits.hits.forEach((hit, index) => {


        var place = {
            "name": hit._source.name,
            "display_phone": hit._source.display_phone,
            "address1": hit._source.location.address1,
            "is_closed": hit._source.is_closed,
            "rating": hit._source.rating,
            "review_count": hit._source.review_count,
            "latitude": hit._source.coordinates.latitude,
            "longitude": hit._source.coordinates.longitude
        };

        places_found.push(place);

    });


}



app.use('/', router);

app.listen(4000, () => {

    for (var i = 0; i < 7; i++) {
        dailyTrips[i] = [];
    }

    console.log('Make sure you execute following command before you start the Angular client');

    console.log('');
    console.log('--------------------------------------------------------');

    console.log('curl -H "Content-Type: application/json" -XPUT "http://localhost:9200/divvy_station_logs/_settings"  -d "{\"index\":{\"max_result_window\":10000000}}"');

    console.log('--------------------------------------------------------');
    console.log('');

    console.log('Express server running on port 4000')
});