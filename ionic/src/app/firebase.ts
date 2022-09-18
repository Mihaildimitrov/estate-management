import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/app-check';
import { environment } from '../environments/environment';


export type IAuth = firebase.auth.Auth;
export type IFirestore = firebase.firestore.Firestore;
export type IDatabase = firebase.database.Database;
export type IStorage = firebase.storage.Storage;
export type IFunctions = firebase.functions.Functions;
export type IDocumentData = firebase.firestore.DocumentData;
export type IQuery<T = IDocumentData> = firebase.firestore.Query<T>;
export type IQuerySnapshot = firebase.firestore.QuerySnapshot;
export type IFirebaseUser = firebase.User;

export class Timestamp extends firebase.firestore.Timestamp { };
export class FieldPath extends firebase.firestore.FieldPath { };

export const ServerTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

export const FirebaseAuthNamespace = firebase.auth;

export const FirebaseApp = () => {
    return !firebase.apps.length ? firebase.initializeApp(environment.firebase) : firebase.app();
};

export const Auth = (): IAuth => {
    const auth = FirebaseApp().auth() as IAuth;
    if (environment.env === "LOCAL") auth.useEmulator("http://localhost:9099");
    return auth;
};

export const Firestore = (): IFirestore => {
    const firestore = FirebaseApp().firestore() as IFirestore;
    if (environment.env === "LOCAL" && firestore['_delegate']['_settings']['host'] !== 'localhost:8080') firestore.useEmulator("localhost", 8080);
    return firestore;
};

export const Database = (): IDatabase => {
    const database = FirebaseApp().database() as IDatabase;
    if (environment.env === "LOCAL") database.useEmulator("localhost", 9000);
    return database;
};

export const Storage = (): IStorage => {
    const storage = FirebaseApp().storage() as IStorage;
    if (environment.env === "LOCAL") storage.useEmulator("localhost", 9199);
    return storage;
};

export const Functions = (): IFunctions => {
    const functions = FirebaseApp().functions() as IFunctions;
    if (environment.env === "LOCAL") functions.useEmulator("localhost", 5001);
    return functions;
};