import { combineReducers } from 'redux';

import examReducer from './Exam.reducer';
import notificationReducer from './Notification.reducer';
import demandHasExamJoinReducer from './DemandHasExamJoin';
import medExamResult from './MedExamResult';
import userReducer from './User';

const rootReducer = combineReducers({
    Examination: examReducer,
    Notification: notificationReducer,
    DemandHasExamJoin:demandHasExamJoinReducer,
    MedExamResult: medExamResult,
    User:userReducer,
    
});

export default rootReducer;