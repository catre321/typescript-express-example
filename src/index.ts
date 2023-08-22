import "reflect-metadata";
import {Request, Response} from "express";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import {AppRoutes} from "./routes";
import {AppDataSource} from "./DataSource";
import {mqttJob} from "./mqttJob"

// create connection with database
// note that it's not active database connection
// TypeORM creates connection pools and uses them for your requests
AppDataSource.initialize()
    .then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    // register all application routes
    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: Request, response: Response, next: Function) => {
            route.action(request, response)
                .then(() => next)
                .catch(err => next(err));
        });
    });

    // run app
    app.listen(8080, () => {
        console.log('Express application is up and running on port 8080');
    });

    // run mqtt
    mqttJob();

}).catch(error => console.log("TypeORM connection error: ", error));
