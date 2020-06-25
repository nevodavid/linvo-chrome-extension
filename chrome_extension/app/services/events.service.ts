import { cloneDeep } from 'lodash';
import { axiosInstance } from '../../chrome/extension/todoapp';
import { Widget } from '../store/reducers/widget';

export class EventsService {
  static async createEventGroup(params: {
        id: string,
        groupName: string,
        eventToolOpen: boolean,
        domain: string
    }) {
    return (await axiosInstance.post('/events', params)).data;
  }

  static async saveEventGroup(params: {
        id: string,
        groupName: string,
        eventToolOpen: boolean,
        widget?: Widget,
        domain: string,
        events: Array<{_id?: string, id: string, order: number, url: string, picture: string, match: string}>
    }) {
    const save = cloneDeep(params);
    if (!save.widget.id) {
      delete save.widget;
    }
    return (await axiosInstance.post(`/events/${params.id}`, save)).data;
  }

  static async deleteEventGroup(id: string) {
    return (await axiosInstance.delete(`/events/${id}`, { data: { a: 1 } })).data;
  }

  static async getGroupById(id: string): Promise<{views: number, hits: number}> {
    return (await axiosInstance.get(`/events/${id}`, { data: { a: 1 } })).data;
  }
}
