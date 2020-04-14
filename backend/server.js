const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
var methodOverride = require('method-override');
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

// Configuration
mongoose.connect('mongodb://localhost/reviews', {
    useNewUrlParser: true,
    useCreateIndex: true
});


// Models
var Review = mongoose.model('Review', {
    username: {
        type: String
    },
    restaurant_name: {
        type: String
    },
    reviews: {
        type: String
    },
    rating: {
        type: String
    },
});

// Get reviews
app.post('/getreviews', function(req, res) {
    console.log(req)
    console.log("fetching reviews");
    var query = { username: req.body.username };

    // use mongoose to get all reviews in the database
    //Review.find(function(err, reviews) 
    Review.find(query, function(err, result) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        console.log(result)
        res.json(result); // return all reviews in JSON format
    });
});

// create review and send back all reviews after creation
app.post('/reviews', function(req, res) {
    //----------Getting NULL here---------------------------------------------------------//////
    console.log("creating review");
    console.log(req);
    // create a review, information comes from request from Ionic
    Review.create({
        reviews: req.body.reviews,
        rating: req.body.rating,
        username: req.body.username,
        restaurant_name: req.body.res_name,
        done: false,
    }, function(err) {
        if (err)
            res.send(err);

        // get and return all the reviews after you create another
        Review.find(function(err, reviews) {
            if (err)
                res.send(err)
            res.json(reviews);
        });
    });

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

router.route('/places/detail').post((req, res) => {

    console.log(req.body);
    var str = JSON.stringify(req.body, null, 4);
    console.log(str)

    find_place_detail_from_yelp(req.body.placename).then(function(response) {
        var hits = response;
        console.log(res_datails);
        res.json(res_datails);

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

async function find_place_detail_from_yelp(restaraunt_name) {
    res_datails = [];
    let body = {
        size: 1000,
        from: 0,
        "query": {
            "bool": {
                "must": {
                    "term": { "categories.alias": restaraunt_name }
                },
            }
        }
    }

    results = await esClient.search({ index: 'chicago_yelp_reviews', body: body });
    console.log(results)
    results.hits.hits.forEach((hit, index) => {


        var detail = {
            "name": hit._source.name,
            "display_phone": hit._source.display_phone,
            "address1": hit._source.location.address1,
            "is_closed": hit._source.is_closed,
            "rating": hit._source.rating,
            "review_count": hit._source.review_count,
            "latitude": hit._source.coordinates.latitude,
            "longitude": hit._source.coordinates.longitude
        };
        console.log("find_place_detail_from_yelp")
        console.log(details)
        res_datails.push(detail);

    });


}


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

                "must": {
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
    //console.log(results)
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