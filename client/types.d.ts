/**
 * This file is used to declare global types for the app
 * Couldn't bother to import each type as needed
 */

declare global {
  interface IUser {
    chatId: string;
    name: string;
    id?: string;
    newMessage?: boolean;
  }

  interface IMessage {
    id: string;
    sender: string;
    recipient: string;
    message: string;
    date: string | Date;
  }
}

export {};
