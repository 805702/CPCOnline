const initState = {
    notifications:[
        {
            idNotification:1,
            dateCreatedNotification:'2020-10-10 00:00:00',
            notificationDetails: 'MedicalExamDemad_1',
            statusNotification:'pending',
            dateViewedNotification:'',
            idUser:1
        }
    ]
}

const notificationReducer = (state=initState, action)=>{
    switch(action.type){
        case 'CREATE_NOTIFICATION':
            return {...state, notifications:[...state.notifications, ...action.payload]}
        case 'VIEW_NOTIFICATION':
            let notifs = state.notifications.filter(notif=>notif.idNotification!==action.payload.idNotification)
            return {...state, notifications:[...notifs]}
        default:
            return state
    }
}

export default notificationReducer;