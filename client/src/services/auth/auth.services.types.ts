export type User = {
    _id:string
}

export type AuthResponse = {
    token:string;
    login:boolean;
    user:User
}