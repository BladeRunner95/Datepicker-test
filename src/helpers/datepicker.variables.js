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

export const addMonth = (curDate) => {
  return curDate.clone().add(1, 'months');
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