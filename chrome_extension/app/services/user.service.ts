import { axiosInstance } from '../../chrome/extension/todoapp';

export interface RegisterResponse {
    name: string;
    email: string;
    id: number;
}

export interface UserResponse {
    name: string;
    email: string;
    id: number;
}


export interface User {
    id: number;
    email: string;
    name: string;
    hash: string;
}

export interface Event2 {
    _id: string;
    id: string;
    picture: string;
    url: string;
    match: string;
    order: number;
}

export interface Widget {
    _id: string;
    id: string;
    title: string;
    text: string;
    domain: string;
    __v: number;
}

export interface Event {
    events: Event2[];
    _id: string;
    user: string;
    domain: string;
    id: string;
    groupName: string;
    eventToolOpen: boolean;
    isSyncedWithServer: boolean;
    __v: number;
    widget: Widget;
}

export interface Widget2 {
    _id: string;
    id: string;
    user: string;
    title: string;
    text: string;
    domain: string;
    __v: number;
}

export interface LoginResponse {
    user: User;
    events: Event[];
    widgets: Widget2[];
}

export class UserService {
  static async register(fullname: string, email: string, password: string): Promise<RegisterResponse> {
    return (await axiosInstance.post('/auth/register', { fullname, email, password })).data;
  }
  static async login(email: string, password: string): Promise<LoginResponse> {
    return (await axiosInstance.post('/auth/login', { email, password })).data;
  }
}
