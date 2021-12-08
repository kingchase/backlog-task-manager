import express from 'express'
import {Request, Response} from "express"
import { createConnection } from 'typeorm'
import { User } from './entities/user.entity'
import cors from 'cors'
import logger from 'morgan'
import bodyParser, { json } from 'body-parser'
import {OAuth2Client} from 'google-auth-library'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { Task } from './entities/task.entity'
import { Category } from './entities/category.entity'

createConnection().then(connection => {
    const userRepository = connection.getRepository(User);
    const taskRepository = connection.getRepository(Task);
    const categoryRepository = connection.getRepository(Category);

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
    app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

    // allow origins
    const allowedOrigins = [process.env.FRONTEND_URL||'http://localhost:3000']

    const options: cors.CorsOptions = {
        origin: allowedOrigins,
        credentials: true
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
            const options = {
                httpOnly: true,
                signed: true
            }
            const id = ticket.getUserId()||"-1";
            res.cookie('backlog_id', id, options);
            res.status(200).send();
            
        }).catch((e) => {
            res.status(500).json({'error': e});
        })
    })

    app.post("/tasks/add-task", async function (req: Request, res: Response) {
        try {
            const user = await userRepository.findOneOrFail({where: {user_id: req.signedCookies.backlog_id}});
            let cat = await categoryRepository.findOne({where: {category_name: req.body.category}});
            if (!cat) {
                cat = categoryRepository.create();
                cat.category_name = req.body.category;
                categoryRepository.save(cat);
            }
            let categories:Category[] = [];
            // await req.body.categories.forEach(async (element:string) => {
            //     const cat = await categoryRepository.findOne({where: {category_name: element}});
            //     if (cat) {
            //         categories.push(cat);
            //     } else {
            //         let mycat = categoryRepository.create();
            //         mycat.category_name = element;
            //         await categoryRepository.save(mycat);
            //         categories.push(mycat);
            //     }
            // });
            const task = taskRepository.create();
            task.user = user;
            task.task_name = req.body.task_name;
            task.setCategory(cat);
            // categories.forEach(async element => {
            //     element.tasks.push(task);
            //     await categoryRepository.save(element);
            // });
            task.time_estimate = req.body.time_estimate;
            task.expiration_date = new Date(req.body.expiration_date);
            await connection.manager.save(task);
            res.send(task.task_id);

        } catch (e) {
            console.log(e);
            console.log(req.signedCookies)
            res.status(500).send();
        }
    })

    app.post("/tasks/remove-task", async function (req:Request, res: Response) {
        try {
            const task = await taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.user", "user")
            .where("user_id = :id", {id: req.signedCookies.backlog_id})
            .where("task_id = :t_id", {t_id: req.body.task_id})
            .getOneOrFail();

            taskRepository.remove(task);
            res.status(200).send();
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    })

    app.get('/', (_, res) => {
        res.status(200).send()
    })
    
    app.get("/tasks/get-tasks", async function(req: Request, res: Response) {
        // const tasks = await taskRepository
        //     .createQueryBuilder("task")
        //     .leftJoinAndSelect("task.user", "user")
        //     .where("user_id = :id", {id: req.signedCookies.backlog_id})
        //     .getMany();
        const tasks = await taskRepository.find({
            join: {alias: "task",
                leftJoinAndSelect: {
                    user: "task.user",
                    category: "task.category"
                },
            },
            where: {user: req.signedCookies.backlog_id}
        })
        res.send(JSON.stringify({"tasks": tasks}));
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
