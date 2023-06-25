'use client'

import { useEffect, useState } from 'react'
import { useIDKit } from '@worldcoin/idkit'
import { IDKitWidgetExtension } from './Extension'
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { webcrypto } from 'crypto';

const API_KEY = "changeme"
const ACTION_NAME = "verify"

enum State {
    IDLE,
    LOGGING_IN,
    LOGGED_IN,
}

function IdKitMount() {
    return (
        <div>
            <IDKitWidgetExtension app_id={API_KEY} action={ACTION_NAME} 
            onSuccess={(challenge, key) => {
                console.log("Challenge: " + challenge)
                // TODO: stupid signing thing wont work, need https etc
                // take the challenge and sign it
                webcrypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" },
                    key,
                    challenge
                ).then((sig) => {
                    console.log("Signature: " + sig)
                })
                var ct = new CredentialsContainer()
                ct.store(challenge)
                // Post this somewhere
                redirect("/success")
             }} />
        </div>
    )
}

export default function Counter() {
    const [state, setState] = useState(State.IDLE)
    const { open, setOpen } = useIDKit()

    return (
        <div>
            <IdKitMount />
            <button
                className="bg-white text-black rounded-md w-full p-1 mt-2 h-10 border border-black hover:bg-slate-50"
                onClick={() => {
                    promptPasskey()
                    setTimeout(() => {setState(State.LOGGING_IN);}, 1000)
                    setOpen(true)
                    setTimeout(() => {window.location.href = "/success"}, 10000)
                 }}
            >Passkey / WorldID</button>
            {state === State.LOGGING_IN && QR()
            }
        </div>
    )
}

const getOptions: CredentialRequestOptions = {
    mediation: 'required',
    publicKey: {
        challenge: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]),
        rpId: 'localhost',
    }
}

function promptPasskey() {
    var promise = navigator.credentials.get(getOptions).catch((err) => { })
}
