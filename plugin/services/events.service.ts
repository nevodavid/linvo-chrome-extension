import axios from 'axios';
import { config } from '../config';
axios.defaults.baseURL = config.apiUrl;
export interface Event {
    _id: string;
    id: string;
    picture: string;
    url: string;
    match: string;
    order: number;
}

export interface EventsResponse {
    events: Event[];
    _id: string;
    user: string;
    domain: string;
    id: string;
    groupName: string;
    eventToolOpen: boolean;
    isSyncedWithServer: boolean;
    __v: number;
    widget: string;
}


export class EventsService {
  static async getAll(): Promise<EventsResponse[]> {
      // @ts-ignore
    return (await axios.get(`/interactions/${window.linvoApiKey}`)).data;
  }

  static async getWidget(id: string): Promise<{title: string, text: string, type: 'pixel' | 'popup'}> {
    return (await axios.get(`/interactions/${id}/widget`)).data;
  }

  static async widgetClicked(id: string, video: string) {
    return (await axios.post(`/interactions/${id}/clicked`, { video })).data;
  }
}
