import { combineReducers } from 'redux';

// @ts-ignore
import user from './user';
import event from './event';
import widgets from './widget';


export default combineReducers({ user, event, widgets });
