import {cert,getApps,initializeApp} from 'firebase-admin/app'
// const admin = require("firebase-admin");
/* 
    Forma indicada pelo firebase
    var serviceAccount = require("path/to/serviceAccountKey.json");
        admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
*/

/*
    Inicialização do firebase no backend, aqui vamos usar para validar/verificar as credenciais do 
    firebase que vamos receber do front-end para o back-end
*/

import { env } from './env'
const initializeFirebaseAdmin = ():void=>{
    if(getApps().length>0) {
        return
    }else{
        const {FIREBASE_CLIENT_EMAIL,FIREBASE_PRIVATE_KEY,FIREBASE_PROJECT_ID} = env
        try {
            initializeApp({
                credential:cert({
                    projectId:FIREBASE_PROJECT_ID,
                    clientEmail:FIREBASE_CLIENT_EMAIL,
                    privateKey:FIREBASE_PRIVATE_KEY,
                })
            })
        } catch (err) {
            console.error("Falha ao conectar com o firebase",err)
            process.exit(1)
        }
    }

}

export default initializeFirebaseAdmin;




















