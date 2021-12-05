import React from "react";
import { GoogleLogin } from 'react-google-login'

const clientId = '214020505514-s9af0de9brcqal7edqstfidt61sgo9gk.apps.googleusercontent.com'

export default function Login() {
    const onSuccess = (res:any) => {
        console.log('[Login Success] currentUser:', res.profileObj)
    }

    const onFailure = (res:any) => {
        console.log('[Login Failed] res:', res)
    }

    const handleLogin = async (googleData:any) => {
        const res = await fetch(process.env.BACKEND_URL + "/api/v1/auth/google", {
            method: "POST",
            body: JSON.stringify({
                token: googleData.tokenId
            }),
            headers: {
                "Content-Type": "application/json"
            }
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