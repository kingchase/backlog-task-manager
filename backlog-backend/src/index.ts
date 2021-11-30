import express from 'express'
import {Request, Response} from "express"
import { createConnection } from 'typeorm'
import { User } from './entities/user.entity'
import cors from 'cors'
import logger from 'morgan'
import bodyParser from 'body-parser'
import {OAuth2Client} from 'google-auth-library'
import dotenv from 'dotenv'

createConnection().then(connection => {
    const userRepository = connection.getRepository(User);

    dotenv.config() // reads .env file into process.env

    const app = express()
    const port = 9000

    //OAuth
    const client = new OAuth2Client(process.env.CLIENT_ID);

    // middleware
    // app.use(cors);
    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // allow origins
    const allowedOrigins = [process.env.FRONTEND_URL||'']

    const options: cors.CorsOptions = {
        origin: allowedOrigins
    };
    app.use(cors(options))


    // requests
    app.post("/api/v1/auth/google", async (req: Request, res: Response) => {
        const {token} = req.body;

        await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        }).then(async (ticket) => {
            const resp = ticket.getPayload();
            if (resp) {
                const {email} = resp;
                try {
                    const user = await userRepository.findOneOrFail(ticket.getUserId()||-1);
                    user.email_address = email||user.email_address;
                    userRepository.save(user);
                } catch {
                    const id = ticket.getUserId()||"-1";
                    if (id != "-1") {
                        const user = userRepository.create({
                            user_id: id,
                            email_address: email
                        });
                        userRepository.save(user);
                    }

                }
            }
            
        })
    })

    app.get('/', (_, res) => {
        res.status(200).send()
    })
    
    app.get("/tasks/:user", async function(req: Request, res: Response) {
        const results = await userRepository.findOne(req.params.id);
        return res.send(results);
    })

    // app.post("/users/:id", async function(req: Request, res: Response) {
    //     const user = await userRepository.create(req.body);
    //     const results = await userRepository.save(user);
    //     return res.send(results);
    // })

    // app.put("/users/add", async function(req: Request, res: Response) {
    //     try {
    //         const user = await userRepository.findOneOrFail(req.params.id);
    //         userRepository.merge(user, req.body);
    //         const results = await userRepository.save(user);
    //         return res.send(results);
    //     } catch {
    //         res.status(400).send()
    //         // might just create user later
    //     }
    // })
    
    
    app.listen(port, () => console.log(`Running on port ${port}`))
})
