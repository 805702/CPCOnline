import { combineReducers } from 'redux';

import awaitConfirmation from './AwaitConfirmation';
import demandHasExamJoinReducer from './DemandHasExamJoin';
import demandResults from './DemandResults';
import examReducer from './Exam.reducer';
import examCategory from './ExamCategory';
import isAuthenticatedReducer from './IsAuthenticated';
import medExamResultReducer from './MedExamResult';
import medicalExamDemandReducer from './MedicalExamDemand';
import medPReducer from './MedP';
import notificationReducer from './Notification.reducer';
import patientReducer from './Patient';
import personnel from './Personnel';
import requestExamsReducer from './RequestExams';
import toComplete from './ToComplete';
import toPay from './ToPay';
import userReducer from './User';

const rootReducer = combineReducers({
    AwaitConfirmation:awaitConfirmation,
    DemandHasExamJoin:demandHasExamJoinReducer,
    DemandResults:demandResults,
    Examination: examReducer,
    ExamCategory: examCategory,
    IsAuthenticated: isAuthenticatedReducer,
    MedExamResult: medExamResultReducer,
    MedicalExamDemand: medicalExamDemandReducer,
    MedP:medPReducer,
    Notification: notificationReducer,
    Patient:patientReducer,
    Personnel: personnel,
    RequestExams:requestExamsReducer,
    ToComplete: toComplete,
    ToPay: toPay,
    User:userReducer,
    
});

export default rootReducer;