import {dateActionTypes} from "../types/date.actionTypes";

export const dateActions = {
    setStartDate,
    setFinishDate,
    setStartFinishDate,
    setFinalStartDate,
    setFinalFinishDate,
    deleteStartDate,
    deleteFinishDate
}

function setStartDate(selectedDate) {
    return {type: dateActionTypes.SETSTARTDATE, selectedDate}
}

function setFinishDate(selectedDate) {
    return {type: dateActionTypes.SETFINISHDATE, selectedDate}
}

function setStartFinishDate(selectedDate) {
    return {type: dateActionTypes.SETSTARTFINISHDATE, selectedDate}
}

function setFinalStartDate(selectedDate) {
    return {type: dateActionTypes.SETFINALSTARTDATE, selectedDate}
}

function setFinalFinishDate(selectedDate) {
    return {type: dateActionTypes.SETFINALFINISHDATE, selectedDate}
}

function deleteStartDate() {
    return {type: dateActionTypes.DELETESTARTDATE}
}

function deleteFinishDate() {
    return {type: dateActionTypes.DELETEFINISHDATE}
}


