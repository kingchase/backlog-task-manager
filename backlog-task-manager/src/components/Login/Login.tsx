import React from "react";
import { GoogleLogin } from 'react-google-login'
import dotenv from 'dotenv'

const clientId = '214020505514-s9af0de9brcqal7edqstfidt61sgo9gk.apps.googleusercontent.com'

dotenv.config({path: '../../.env'});

let url:string;
        if (process.env.BACKEND_URL) {
            url = process.env.BACKEND_URL;
        } else {
            url = "http://localhost:9000"
        }

export default function Login() {
    const onSuccess = (res:any) => {
        console.log('[Login Success] currentUser:', res.profileObj)
    }

    const onFailure = (res:any) => {
        console.log('[Login Failed] res:', res)
    }

    const handleLogin = async (googleData:any) => {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');  
        headers.append('Access-Control-Allow-Credentials', 'true');
        const res = await fetch(url + "/api/v1/auth/google", {
            method: "POST",
            headers: headers,
            redirect: 'follow',
            credentials: 'include',
            body: JSON.stringify({
                token: googleData.tokenId
            }),
            
        })
        const data = await res.json();
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