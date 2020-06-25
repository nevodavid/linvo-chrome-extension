import { UserResponse } from '../../services/user.service';
import { UserActionsEnum, UserActionsList } from '../actions/user';

const initialState = {
  injectToTest: false
};

interface UserState extends UserResponse {}

export default function user(state: Partial<UserState & {injectToTest: boolean}> = initialState, action: UserActionsList) {
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

    case UserActionsEnum.CHANGE_INJECT_STATE: {
      return {
        ...state,
        injectToTest: !state.injectToTest
      };
    }

    default:
      return {
        ...state
      };
  }
}
