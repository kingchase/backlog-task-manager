import express from 'express'
import {Request, Response} from "express"
import { createConnection } from 'typeorm'
import { User } from './entities/user.entity'
import cors from 'cors'
import logger from 'morgan'
import bodyParser from 'body-parser'

createConnection().then(connection => {
    const userRepository = connection.getRepository(User);

    const app = express()
    const port = 9000

    // middleware
    // app.use(cors);
    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    //allow origins
    // const allowedOrigins = ['http://localhost:3000']

    // const options: cors.CorsOptions = {
    //     origin: allowedOrigins
    // };
    // app.use(cors(options))


    // requests
    app.get('/', (_, res) => {
        res.status(200).send()
    })
    
    app.get("/tasks/:user", async function(req: Request, res: Response) {
        const results = await userRepository.findOne(req.params.id);
        return res.send(results);
    })

    app.post("/users/:id", async function(req: Request, res: Response) {
        const user = await userRepository.create(req.body);
        const results = await userRepository.save(user);
        return res.send(results);
    })

    app.put("/users/add", async function(req: Request, res: Response) {
        try {
            const user = await userRepository.findOneOrFail(req.params.id);
            userRepository.merge(user, req.body);
            const results = await userRepository.save(user);
            return res.send(results);
        } catch {
            res.status(400).send()
            // might just create user later
        }
    })
    
    
    app.listen(port, () => console.log(`Running on port ${port}`))
})
