import { combineReducers } from 'redux';

import demandHasExamJoinReducer from './DemandHasExamJoin';
import examReducer from './Exam.reducer';
import medExamResultReducer from './MedExamResult';
import medicalExamDemandReducer from './MedicalExamDemand';
import medPReducer from './MedP';
import notificationReducer from './Notification.reducer';
import patientReducer from './Patient';
import requestExamsReducer from './RequestExams';
import userReducer from './User';

const rootReducer = combineReducers({
    DemandHasExamJoin:demandHasExamJoinReducer,
    Examination: examReducer,
    MedExamResult: medExamResultReducer,
    MedicalExamDemand: medicalExamDemandReducer,
    MedP:medPReducer,
    Notification: notificationReducer,
    Patient:patientReducer,
    RequestExams:requestExamsReducer,
    User:userReducer,
    
});

export default rootReducer;