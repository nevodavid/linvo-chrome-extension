import { axiosInstance } from '../../chrome/extension/todoapp';
import { Widget } from '../store/reducers/widget';
import { cloneDeep } from 'lodash';

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
}
