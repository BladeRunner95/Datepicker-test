import {dateActionTypes} from "../types/date.actionTypes";
import moment from "moment";


export const initialState = {
    dateNow: moment(),
    startDate: moment(),
    finishDate: moment()
};


export const dateReducer = (state = initialState, action ) => {
    switch (action.type) {
        case dateActionTypes.SETSTARTDATE :
            return {
                ...state,
                startDate: action.selectedDate
            };

        case dateActionTypes.SETFINISHDATE :
            return {
                ...state,
                finishDate: action.selectedDate
            };

        case dateActionTypes.SETSTARTFINISHDATE :
            return {
                ...state,
                startDate: action.selectedDate,
                finishDate: action.selectedDate
            };

        case dateActionTypes.SETFINALSTARTDATE :
            return {
                ...state,
                finalStartDate: action.selectedDate
            };

        case dateActionTypes.SETFINALFINISHDATE :
            return {
                ...state,
                finalFinishDate: action.selectedDate
            };

        case dateActionTypes.DELETESTARTDATE :
        const {finalStartDate, ...rest} = state;
            return {
                ...rest
            };

        case dateActionTypes.DELETEFINISHDATE :
            const {finalFinishDate, ...restParams} = state;
            return {
                ...restParams
            }
        default:
            return state;
    }
}