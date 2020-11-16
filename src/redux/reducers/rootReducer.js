import { combineReducers } from 'redux';

import awaitConfirmation from './AwaitConfirmation';
import demandHasExamJoinReducer from './DemandHasExamJoin';
import demandResults from './DemandResults';
import examReducer from './Exam.reducer';
import isAuthenticatedReducer from './IsAuthenticated';
import medExamResultReducer from './MedExamResult';
import medicalExamDemandReducer from './MedicalExamDemand';
import medPReducer from './MedP';
import notificationReducer from './Notification.reducer';
import patientReducer from './Patient';
import personnel from './Personnel';
import requestExamsReducer from './RequestExams';
import userReducer from './User';

const rootReducer = combineReducers({
    AwaitConfirmation:awaitConfirmation,
    DemandHasExamJoin:demandHasExamJoinReducer,
    DemandResults:demandResults,
    Examination: examReducer,
    IsAuthenticated: isAuthenticatedReducer,
    MedExamResult: medExamResultReducer,
    MedicalExamDemand: medicalExamDemandReducer,
    MedP:medPReducer,
    Notification: notificationReducer,
    Patient:patientReducer,
    Personnel: personnel,
    RequestExams:requestExamsReducer,
    User:userReducer,
    
});

export default rootReducer;