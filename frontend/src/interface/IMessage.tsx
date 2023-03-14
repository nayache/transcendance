
export interface IMessage {
    author: string;
    content: string;
    date: Date;
}

export interface IMessageEvRecv {
    author: string,
    message: string;
    date: Date;
}

export interface Discussion {
    pseudo: string;
    avatar: string | undefined;
    unread: number;
}