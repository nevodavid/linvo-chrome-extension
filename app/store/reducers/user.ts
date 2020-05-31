import { UserResponse } from '../../services/user.service';
import {UserActionsList, UserActionsEnum } from '../actions/user';

const initialState = {

};

interface UserState extends UserResponse {}

export default function user(state: Partial<UserState> = initialState, action: UserActionsList) {
  // @ts-ignore
  switch (action.type) {
    case UserActionsEnum.SET_USER:
      return {
        ...state,
        // @ts-ignore
        ...action.payload
      };

    case UserActionsEnum.REMOVE_USER: {
      return {};
    }

    default:
      return {
        ...state
      };
  }
}
