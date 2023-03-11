
export interface IMessage {
    author: string;
    content: string;
    date: Date;
}

export interface Discussion {
    pseudo: string;
    avatar: string | undefined;
    unread: number;
}