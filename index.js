const fs = require('fs');

//connection a graphdb -> serveur
const GraphDB = require('graphdb-js');

let graphdb = new GraphDB({
    hostname: "localhost",
    repository: "ski"
});


/**
 * Query a GraphDB
 *
 */

const prefix = "prefix ex: <http://www.semanticweb.org/tws/tp2#> \n" +
                "prefix owl: <http://www.w3.org/2002/07/owl#> \n" +
                "prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n" +
                "prefix xml: <http://www.w3.org/XML/1998/namespace> \n" +
                "prefix xsd: <http://www.w3.org/2001/XMLSchema#> \n" +
                "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n"


// query pour récupérer tous les trackname

const difficulty1 = prefix +
        "INSERT {?r ex:difficulty 1 .} " +
        "WHERE{?r a ex:BlueRun .}";
const difficulty2 = prefix +
        "INSERT {?r ex:difficulty 2 .} " +
        "WHERE{?r a ex:RedRun .}";
const difficulty3 = prefix +
        "INSERT {?r ex:difficulty 3 .} " +
        "WHERE{?r a ex:BlackRun .}";
const difficulty0 = prefix +
        "INSERT {?r ex:difficulty 0 .} " +
        "WHERE{?r a ex:SkiLift .}";
const routeDuration = prefix +
        "insert {?x ex:duration ?tt.} " +
        "where {"+
        "?x a ex:Route. ?x ex:hasFirstElement ?fx. ?x ex:hasRest ?rx. ?fx ex:duration ?dfx. ?rx ex:duration ?drx " +
        "bind(?dfx + ?drx AS ?tt)" +
        "}";
const routeDifficulty = prefix +
        "insert {?x ex:difficulty ?dx.} " +
        "where {" +
        "?x a ex:Route. ?x ex:hasFirstElement ?fx. ?x ex:hasRest ?rx. ?fx ex:difficulty ?dfx. ?rx ex:difficulty ?drx " +
        "bind(if(?dfx >= ?drx, ?dfx, ?drx) as ?dx)" +
        "}";
const routeBelongsFirst = prefix +
        "insert {?fx ex:belongsTo ?x.} " +
        "where {" +
        "?x a ex:Route. ?x ex:hasFirstElement ?fx." +
        "}";
const routeBelongsRest = prefix +
        "insert {?brx ex:belongsTo ?x.} " +
        "where {" +
        "?x a ex:Route. ?x ex:hasRest ?rx. ?brx ex:belongsTo ?rx." +
        "}";
const routeBelongsPlace = prefix +
        "insert {?p ex:belongsTo ?x.} " +
        "where {" +
        "?p a ex:Place. ?p (ex:isStartOf | ex:isEndOf) ?s. ?s ex:belongsTo ?x." +
        "}";
const routeBelongsRestaurant = prefix +
        "insert {?r ex:belongsTo ?x.} " +
        "where {" +
        "?r a ex:Restaurant. ?r ex:locatedAt ?p. ?p ex:belongsTo ?x." +
        "}";
const resAllTrackName = [];
vari = '';
console.log('hihihihihihihihi');
async function insertDifficulty1() {
    await graphdb.Query.query(difficulty1, (err, data) => {
                const i = JSON.parse(data);
                console.log(i);
                console.log(err);

                // i.results.bindings.forEach((name, a) => {
                //     vari = i.results.bindings[a].trk.value;
                //     resAllTrackName.push(vari);


                });
            });
            console.log(i);
};

insertDifficulty1().then();

async function insertDifficulty2() {
    await graphdb.Query.query(difficulty2, (err, data) => {
                // const i = JSON.parse(data);
                console.log(data);
                console.log(err);

                // i.results.bindings.forEach((name, a) => {
                //     vari = i.results.bindings[a].trk.value;
                //     resAllTrackName.push(vari);
                //
                // });
            });
};
insertDifficulty2().then();

async function insertDifficulty3() {
    await graphdb.Query.query(difficulty3, (err, data) => {
                // const i = JSON.parse(data);
                console.log(data);
                console.log(err);

                // i.results.bindings.forEach((name, a) => {
                //     vari = i.results.bindings[a].trk.value;
                //     resAllTrackName.push(vari);
                //
                // });
            });
};
insertDifficulty3().then();
// // query pour récuperer tous les pois par track
// var resAllPOIsByTrack = [];
// var tracksInfoArray = [];
// var vara ='';
// var tempo ='';
//
// async function getAllPOIsByTrack(trackname) {
//     resAllPOIsByTrack = [];
//     vara ='';
//     tempo ='';
//
//     var allPOIsByTrack = prefix +
//         "select ?namepoi where {" +
//     	"?s a cui:trk." +
//         "?s cui:name \"" + trackname + "\"." +
//         "?poi a cui:POI." +
//         "?t a cui:trkpt." +
//         "?t cui:hasClosePOI ?poi." +
//         "?s cui:trackpoints ?t." +
//         "?poi cui:lat ?lat." +
//         "?poi cui:lon ?lon." +
//         "?poi cui:name ?namepoi" +
//         "}";
//
//     await graphdb.Query.query(allPOIsByTrack, (err, data) => {
//         var obj = JSON.parse(data)
//
//         obj.results.bindings.forEach((name, a) => {
//            vara = obj.results.bindings[a].namepoi.value;
//            resAllPOIsByTrack.push(vara);
//         });
//
//         tracksInfoArray.push([trackname, resAllPOIsByTrack]);
//         resAllPOIsByTrack = [];
//     });
// };
//
// //attend pour être sur d'avoir les résultats
// setTimeout(function(){
//     resAllTrackName.forEach(trackname => {
//         getAllPOIsByTrack(trackname).then();
//     });
// }, 2000);
