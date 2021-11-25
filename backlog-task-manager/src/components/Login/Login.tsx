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

    // NEEDS MORE LOGIC

    return (
        <div>
            <GoogleLogin
                clientId={clientId}
                buttonText='Sign in with Google'
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                style={{marginTop: '100px'}}
                isSignedIn={true}
            />
        </div>
    )
}