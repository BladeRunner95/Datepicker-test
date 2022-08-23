import 'moment/locale/he';
import {extendMoment} from 'moment-range';
import Moment from 'moment';
import moment from "moment";

const momentum = extendMoment(Moment)

export const yearFromNow = (curDate) => {
    const addYear = curDate.clone().add(1, 'years');
    const getRange = momentum.range(curDate, addYear);
    return Array.from(getRange.by('month', {step: 1}))
};

export const getDaysNumbers = (selectedDate) => {
    let daysInMonth = moment(selectedDate).daysInMonth();
    const arrDays = [];
    for (let i = 1; i < daysInMonth + 1; i++) {
        const current = moment(selectedDate).date(i);
        arrDays.push(current);
    }
    return arrDays;
}

export const addMonth = (curDate) => {
  return curDate.clone().add(1, 'months');
};

export const isLastDayOfMonth = (curDate) => {
    if (!curDate) return console.log("the date is not set yet");
    return curDate.clone().endOf('month').isSame(curDate, 'date');
};

export const subtractMonth = (curDate) => {
    return curDate.clone().subtract(1, 'months');
};

export const gridFirstDay = (date) => {
    let firstDay = moment(date).day();
    return {gridColumnStart: `${firstDay + 1}`};
}

export const isBeforeDate = (curDate, before) => {
    return moment(curDate).isBefore(before);
}

export const isBeforeOrSameDate = (curDate, before) => {
    return moment(curDate).isSameOrBefore(before);
}

export const getWeeks = {
    Sunday: "א'",
    Monday: "ב'",
    Tuesday: "ג'",
    Wednesday: "ד'",
    Thursday: "ה'",
    Friday: "ו'",
    Saturday: "ש'"
}