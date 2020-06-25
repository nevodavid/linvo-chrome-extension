import { axiosInstance } from '../../chrome/extension/todoapp';

export class WidgetsService {
  static async createWidget(params: {
        id: string,
        title: string,
        type: 'pixel' | 'popup',
        text: string,
        domain: string
    }) {
    return (await axiosInstance.post('/widgets', params)).data;
  }

  static async updateWidget(params: {
        id: string,
        title: string,
        type: 'pixel' | 'popup',
        text: string,
        domain: string
    }) {
    return (await axiosInstance.put(`/widgets/${params.id}`, params)).data;
  }

  static async deleteWidget(id: string) {
    return (await axiosInstance.delete(`/widgets/${id}`, { data: { a: 1 } })).data;
  }
}
