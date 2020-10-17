import { combineReducers } from 'redux';

import examReducer from './Exam.reducer';
import notificationReducer from './Notification.reducer';

const rootReducer = combineReducers({
    Examination: examReducer,
    Notification: notificationReducer,

});

export default rootReducer;