import React from "react";
import { GoogleLogout } from "react-google-login";

const clientId = '214020505514-s9af0de9brcqal7edqstfidt61sgo9gk.apps.googleusercontent.com'

export default function Logout() {
    const onSuccess = () => {
        alert('Successful Logout')
    }
    
    return (
        <div>
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}
