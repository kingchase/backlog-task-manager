import React from "react";
import { GoogleLogin } from 'react-google-login'
import dotenv from 'dotenv'
import { each } from "@reduxjs/toolkit/node_modules/immer/dist/internal";
import { useDispatch } from "react-redux";
import { taskState } from "../Dashboard/taskSlice";
import { createRow } from "../Dashboard/TaskTable/taskTableSlice";

const clientId = '214020505514-s9af0de9brcqal7edqstfidt61sgo9gk.apps.googleusercontent.com'


dotenv.config({path: '../../.env'});

let url:string;
        if (process.env.BACKEND_URL) {
            url = process.env.BACKEND_URL;
        } else {
            url = "http://localhost:9000"
        }

export default function Login() {
    const dispatch = useDispatch();


    const onFailure = (res:any) => {
        console.log('[Login Failed] res:', res)
    }

    const handleLogin = async (googleData:any) => {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');  
        await fetch(url + "/api/v1/auth/google", {
            method: "POST",
            headers: headers,
            redirect: 'follow',
            credentials: 'include',
            body: JSON.stringify({
                token: googleData.tokenId
            }),
            
        }).then(async (res) => {
            await fetch(url + "/tasks/get-tasks", {
                method: "GET",
                headers: headers,
                redirect: 'follow',
                credentials: 'include'
            }).then(async (tasksres) => {
                await tasksres.text().then((txt) => {
                    const {tasks} = JSON.parse(txt);
                    console.log(tasks);
                    tasks.forEach((element:taskState) => {
                        const new_task:taskState = {
                            task_id: element.task_id,
                            task_name: element.task_name,
                            categories: element.categories,
                            time_estimate: element.time_estimate,
                            expiration_date: new Date(element.expiration_date),
                        };
                        dispatch(createRow(new_task));
                    });
                }).catch(e => {
                    console.log(e);
                })
                
            })
        })
        
    }
    // TODO: deal with token expiration and renewal

    return (
        <div>
            <GoogleLogin
                clientId={clientId}
                buttonText='Sign in with Google'
                onSuccess={handleLogin}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                style={{marginTop: '100px'}}
                isSignedIn={true}
            />
        </div>
    )
}