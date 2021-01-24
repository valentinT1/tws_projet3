const SparqlClient = require('sparql-http-client')
const client = new SparqlClient({
    endpointUrl: 'http://localhost:7200/repositories/ski',
    updateUrl: 'http://localhost:7200/repositories/ski/statements'
});

const prefix = "prefix ex: <http://www.semanticweb.org/tws/tp2#>\n" +
    "prefix owl: <http://www.w3.org/2002/07/owl#>\n" +
    "prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
    "prefix xml: <http://www.w3.org/XML/1998/namespace>\n" +
    "prefix xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
    "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n"

/*
* Mise en place de la propriété difficulty
*/
async function setDifficulty() {
     const diffBlueRunQuery = prefix +
        "INSERT {?r ex:difficulty 1 .}\n" +
        "WHERE{?r a ex:BlueRun .}"
     await client.query.update(diffBlueRunQuery)
     const diffRedRunQuery = prefix +
        "INSERT {?r ex:difficulty 2 .}\n" +
        "WHERE{?r a ex:RedRun .}"
     await client.query.update(diffRedRunQuery)
     const diffBlackRunQuery = prefix +
        "INSERT {?r ex:difficulty 3 .}\n" +
        "WHERE{?r a ex:BlackRun .}"
     await client.query.update(diffBlackRunQuery)
     const diffSkiLiftQuery = prefix +
        "INSERT {?r ex:difficulty 0 .}\n" +
        "WHERE{?r a ex:SkiLift .}"
     await client.query.update(diffSkiLiftQuery)
 }

/*
* Fonction pour la duree d'un chemin
 */
// fonction pour l'ajout de la duree sur tout les troncons d'un chemin récursivement
function inferDurationLoop() {
    getRouteDurationNumber().then(number => {
        let previousNumber = number;
        inferDuration().then(() => {
            getRouteDurationNumber().then(number => {
                if (number > previousNumber) {
                    inferDurationLoop()
                } else {
                    console.log("infering duration OK !")
                }
            })
        });
    });
    // fonction pour ajout de la duree
    async function inferDuration() {
        const inferDurationQuery = prefix +
            "insert {?x ex:duration ?tt.}\n" +
            "where {\n" +
            "    ?x a ex:Route. ?x ex:hasFirstElement ?fx. ?x ex:hasRest ?rx. ?fx ex:duration ?dfx. ?rx ex:duration ?drx\n" +
            "    bind(?dfx + ?drx AS ?tt)\n" +
            "}"
        return await client.query.update(inferDurationQuery);
    }
    //fonction pour le nombre de boucle pour la durée
    async function getRouteDurationNumber() {
        const routeDurationQuery = prefix +
            "select (COUNT(?o) AS ?rowCount)\n" +
            "where { \n" +
            "    ?s a ex:Route.\n" +
            "    ?s ex:duration ?o .\n" +
            "} ";
        let stream = await client.query.select(routeDurationQuery);
        let rowCount = 0;
        stream.on('data', result => {
            rowCount = result.rowCount.value;
        })

        let promise = new Promise((resolve, reject) => {
            stream.on('finish', () => {
                resolve(rowCount)
            })
        });
        return await promise;
    }
}

/*
* Fonction pour la difficulé
 */
//fonction pour ajouter la difficulté d'un chemin recursivement
function inferDifficultyLoop() {
    getRouteDifficultyNumber().then(number => {
        let previousNumber = number;
        inferDifficulty().then(() => {
            getRouteDifficultyNumber().then(number => {
                if (number > previousNumber) {
                    inferDifficultyLoop()
                } else {
                    console.log("infering difficulty OK !")
                }
            })
        });
    });
    // fonction pour ajouter la difficulté
    async function inferDifficulty() {
        const inferDifficultyQuery = prefix +
            "insert  {?x ex:difficulty ?dx.}\n" +
            "where {\n" +
            "    ?x a ex:Route.\n" +
            "    ?x ex:hasFirstElement ?fx.\n" +
            "    ?x ex:hasRest ?rx.\n" +
            "    ?fx ex:difficulty ?dfx.\n" +
            "    ?rx ex:difficulty ?drx.\n" +
            "    bind(if(?dfx >= ?drx, ?dfx, ?drx) as ?dx)\n" +
            "}"
        return await client.query.update(inferDifficultyQuery);
    }
    //fonction pour le nombre de boucle pour la durée
    async function getRouteDifficultyNumber() {
        const routeDifficultyQuery = prefix +
            "select (COUNT(?o) AS ?rowCount)\n" +
            "where { \n" +
            "    ?s a ex:Route.\n" +
            "    ?s ex:difficulty ?o .\n" +
            "} ";
        let stream = await client.query.select(routeDifficultyQuery);
        let rowCount = 0;
        stream.on('data', result => {
            rowCount = result.rowCount.value;
        })

        let promise = new Promise((resolve, reject) => {
            stream.on('finish', () => {
                resolve(rowCount)
            })
        });
        return await promise;
    }
}


/*
* Fonctions pour la possession
 */
async function inferBelongsTo() {
    return new Promise((resolve, reject) => {
        inferBelongsToFirst().then(() => {
            recBelongsTo()

            function recBelongsTo() {
                getBelongsToRestNumber().then(number => {
                    let previousNumber = number;
                    inferBelongsToRest().then(() => {
                        getBelongsToRestNumber().then(number => {
                            if (number > previousNumber) {
                                recBelongsTo()
                            } else {
                                resolve()
                            }
                        })
                    });
                })
            }
        })
    });

    async function inferBelongsToRest() {
        const inferBelongsToRestQuery = prefix +
            "insert {?brx ex:belongsTo ?x.}\n" +
            "where {\n" +
            "    ?x a ex:Route. ?x ex:hasRest ?rx. ?brx ex:belongsTo ?rx.\n" +
            "}"
        return await client.query.update(inferBelongsToRestQuery);
    }

    async function inferBelongsToFirst() {
        const inferBelongsToFirstQuery = prefix +
            "insert {?fx ex:belongsTo ?x.}\n" +
            "where {\n" +
            "    ?x a ex:Route. ?x ex:hasFirstElement ?fx.\n" +
            "}"
        return await client.query.update(inferBelongsToFirstQuery);
    }

    async function getBelongsToRestNumber() {
        const belongsToRestQuery = prefix +
            "select (COUNT(?belonger) AS ?rowCount)\n" +
            "where { \n" +
            "    ?belonger ex:belongsTo ?route.\n" +
            "} ";
        let stream = await client.query.select(belongsToRestQuery);
        let rowCount = 0;
        stream.on('data', result => {
            rowCount = result.rowCount.value;
        })

        let promise = new Promise((resolve, reject) => {
            stream.on('finish', () => {
                resolve(rowCount)
            })
        });
        return await promise;
    }
}

/*
* fonction pour la possession d'une place à un chemin
 */
async function inferBelongsToPlace() {
    return new Promise((resolve, reject) => {
        inferBelongsTo().then(() => {
            inferBelongsToPlaceRequest().then(() => {
                resolve()
            })
        });
    });

    async function inferBelongsToPlaceRequest() {
        const inferBelongsToPlaceQuery = prefix +
            "insert {?p ex:belongsTo ?x.}\n" +
            "where {\n" +
            "    ?p a ex:Place. ?p (ex:isStartOf | ex:isEndOf) ?s. ?s ex:belongsTo ?x.\n" +
            "}"
        return await client.query.update(inferBelongsToPlaceQuery);
    }
}

/*
* fonction pour la possesssion d'un restaurant a un chemin
 */
function inferBelongsToRestaurant() {
    inferBelongsToPlace().then(() => {
        insertBelongsToRestaurant().then(() => {
            console.log("infering restaurants OK !")
        })
    });

    async function insertBelongsToRestaurant() {
        const inferBelongsToRestaurantQuery = prefix +
            "insert {?r ex:belongsTo ?x.}\n" +
            "where {\n" +
            "    ?r a ex:Restaurant. ?r ex:locatedAt ?p. ?p ex:belongsTo ?x.\n" +
            "}"
        return await client.query.update(inferBelongsToRestaurantQuery);
    }

}

 /*
 * Execution des fonctions dans l'ordre
 */

 setDifficulty().then(() => {
     inferDurationLoop()
     inferDifficultyLoop()
     inferBelongsTo().then(() => {
         console.log("infering belonging Ski Lifts and Runs OK !")
     })
     inferBelongsToPlace().then(() => {
         console.log("infering places OK !")
     })
     inferBelongsToRestaurant()
 })
