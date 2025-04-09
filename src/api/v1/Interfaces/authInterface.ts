interface ILogIn {
    userName: string;
    password: string;
}

interface ISigUp extends ILogIn {
    fullName: string;
    mobileNumber: number;
    email: string;
}

export type { ILogIn, ISigUp };