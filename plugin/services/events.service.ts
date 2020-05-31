import axios from 'axios';

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
    return (await axios.get(`http://localhost:4000/interactions/${window.linvoApiKey}`)).data;
  }

  static async getWidget(id: string): Promise<{title: string, text: string}> {
    return (await axios.get(`http://localhost:4000/interactions/${id}/widget`)).data;
  }
}
