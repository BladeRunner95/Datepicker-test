import styles from './Calendar.module.css';
import {
    addMonth,
    getWeeks, gridFirstDay,
    isBeforeOrSameDate,
    subtractMonth,
    yearFromNow
} from "../../helpers/datepicker.variables";
import {useEffect, useMemo, useState} from "react";
import moment from 'moment';
import {useDispatch, useSelector} from "react-redux";
import 'moment/locale/he';
import {dateActions} from "../../store/actions/date.actions";

export const Calendar = (props) => {
    const dispatch = useDispatch();
    const currentDate = useSelector(state => state.dateReducer);
    const [showDropdown, setShowDropdown] = useState(false);
    const [days, setDays] = useState([]);
    const [daysFinish, setDaysFinish] = useState([]);


    const yearFromNowMemo = useMemo(() => yearFromNow(currentDate.dateNow), [currentDate.dateNow]);

    const lastAvailable = (currentDate) => {
        return currentDate.isSameOrAfter(yearFromNowMemo[yearFromNowMemo.length - 1])
    }

    const firstAvailable = (selectedDate) => {
        return selectedDate.isSameOrBefore(currentDate.dateNow) || selectedDate.isSame(currentDate.dateNow, 'month');
    }

    const firstAvailableFinish = (finish, start) => {
        return isBeforeOrSameDate(finish, start) || finish.isSame(start, 'month');
    };

    useEffect(() => {
        const getDaysNumbers = (selectedDate) => {
            let daysInMonth = moment(selectedDate).daysInMonth();
            const arrDays = [];
            for (let i = 1; i < daysInMonth + 1; i++) {
                const current = moment(selectedDate).date(i);
                arrDays.push(current);
            }
            return arrDays;
        }
        setDays(getDaysNumbers(currentDate.startDate));
        setDaysFinish(getDaysNumbers(currentDate.finishDate));
    }, [currentDate]);

    useEffect(() => {
        if (currentDate.startDate.isAfter(currentDate.finishDate)) {
            dispatch(dateActions.setFinishDate(currentDate.startDate));
        }
    });


    useEffect(() => {
        if (currentDate.finalFinishDate && currentDate.finalStartDate && currentDate.finalStartDate.isSameOrAfter(currentDate.finalFinishDate)) {
            dispatch(dateActions.deleteFinishDate());
        }
    });


    const handleOpenMonthsPicker = () => {
        setShowDropdown(prev => !prev);
    };

    const handleClickBack = () => {
        if (props.initial) {
            dispatch(dateActions.setStartDate(subtractMonth(currentDate.startDate)));
        } else {
            dispatch(dateActions.setFinishDate(subtractMonth(currentDate.finishDate)));
        }
    };

    const handleClickForward = () => {
        if (props.initial) {
            dispatch(dateActions.setStartDate(addMonth(currentDate.startDate)));
        } else {
            dispatch(dateActions.setFinishDate(addMonth(currentDate.finishDate)));
        }
    };

    const handleChooseMonth = (month) => {
        if (props.initial) {
            dispatch(dateActions.setStartDate(month));
        } else {
            dispatch(dateActions.setFinishDate(month));
        }
    };

    const handleChooseDate = (date) => {
        if (props.initial) {
            if (date.isSame(currentDate.finalStartDate)) {
                dispatch(dateActions.deleteStartDate());
                dispatch(dateActions.deleteFinishDate());
                return;
            }
            dispatch(dateActions.setFinalStartDate(date));
        } else {
            if (date.isSame(currentDate.finalFinishDate)) {
                dispatch(dateActions.deleteFinishDate());
                return;
            }
            dispatch(dateActions.setFinalFinishDate(date));
        }
    }

    return (
        <div className={styles.calendarContainer}>
            <div className={styles.title}>
                {props.title}
            </div>
            <div className={styles.yearMonthContainer}>
                <div className={styles.yearMonthInner}>


                    {props.initial ?
                        <button type="button"
                                disabled={firstAvailable(currentDate.startDate)}
                                className={`${styles.rightArrowBtn}`}
                                onClick={handleClickBack}>
                            <div
                                className={firstAvailable(currentDate.startDate) ?
                                    `${styles.arrowIcon} ${styles.arrowIconDisabled}` : `${styles.arrowIcon}`}/>
                        </button>
                        :
                        <button type="button"
                                disabled={firstAvailableFinish(currentDate.finishDate, currentDate.startDate)}
                                className={`${styles.rightArrowBtn}`}
                                onClick={handleClickBack}>
                            <div
                                className={firstAvailableFinish(currentDate.finishDate, currentDate.startDate) ?
                                    `${styles.arrowIcon} ${styles.arrowIconDisabled}` : `${styles.arrowIcon}`}/>
                        </button>
                    }


                    <div className={styles.pickerInputContainer} onClick={handleOpenMonthsPicker}>
                        <input readOnly className={styles.pickerInput} type="text"
                               value={props.initial ?
                                   currentDate.startDate.format(`MMMM YYYY`) :
                                   currentDate.finishDate.format(`MMMM YYYY`)
                               }/>
                        <span className={styles.dropdownIcon}/>

                        {showDropdown &&
                            <div className={styles.openedWrapper}>
                                <div className={styles.dropdownContainer}>
                                    <div className={styles.dropdownFirstRow}>
                                        <input readOnly
                                               className={`${styles.pickerInput} ${styles.pickerInputDropdown}`}
                                               type="text"
                                               value={props.initial ?
                                                   currentDate.startDate.format(`MMMM YYYY`) :
                                                   currentDate.finishDate.format(`MMMM YYYY`)}
                                        />
                                        <span className={`${styles.dropdownIcon} ${styles.dropdownIconUp}`}/>
                                    </div>
                                    <div className={styles.dropdownListContainer}>
                                        {
                                            yearFromNow(currentDate.dateNow).map(month => (
                                                props.initial ?
                                                    <button key={month.format(`MMMM YYYY`)}
                                                            type='button'
                                                            onClick={() => handleChooseMonth(month)}
                                                            className={styles.dropdownItem}>{month.format(`MMMM YYYY`)}
                                                    </button>
                                                    :
                                                    <button key={month.format(`MMMM YYYY`)}
                                                            type='button'
                                                            disabled={month.isBefore(currentDate.startDate)}
                                                            onClick={() => handleChooseMonth(month)}
                                                            className={styles.dropdownItem}>{month.format(`MMMM YYYY`)}
                                                    </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    {props.initial ?
                        <button type="button"
                                disabled={lastAvailable(currentDate.startDate)}
                                className={`${styles.leftArrowBtn} ${styles.rightArrowBtn}`}
                                onClick={handleClickForward}
                        >
                            <div
                                className={lastAvailable(currentDate.startDate) ?
                                    `${styles.arrowIcon} ${styles.arrowIconDisabled}` : `${styles.arrowIcon}`}/>
                        </button> :
                        <button type="button"
                                disabled={lastAvailable(currentDate.finishDate)}
                                className={`${styles.leftArrowBtn} ${styles.rightArrowBtn}`}
                                onClick={handleClickForward}
                        >
                            <div
                                className={lastAvailable(currentDate.finishDate) ?
                                    `${styles.arrowIcon} ${styles.arrowIconDisabled}` : `${styles.arrowIcon}`}/>
                        </button>
                    }

                </div>
                <div className={styles.tableContainer}>
                    <div className={styles.tableInner}>
                        <div className={styles.weekContainer}>
                            {Object.values(getWeeks).map(day => (
                                <div key={day}
                                     className={styles.weekDay}>
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className={styles.dayHeader}>
                            {
                                props.initial ? days.map((date, index) => (
                                        <div
                                            key={date.format('DDDD')}
                                            style={index === 0 ? gridFirstDay(date) : undefined}
                                        >
                                            {date.isSame(currentDate.finalStartDate) ?
                                                <div
                                                    className={`${styles.dayEl} ${styles.dayElSelected}`}
                                                    onClick={() => handleChooseDate(date)}
                                                >
                                                    {date.format('D')}
                                                </div>
                                                :
                                                <div
                                                    className={
                                                        moment(date).isBefore(currentDate.dateNow) ?
                                                            `${styles.dayEl} ${styles.dayElDisabled}` :
                                                            `${styles.dayEl} ${styles.dayElAvailable}`
                                                    }
                                                    onClick={() => handleChooseDate(date)}>
                                                    {date.format('D')}
                                                </div>
                                            }
                                        </div>
                                    ))
                                    : daysFinish.map((date, index) => (
                                        <div
                                            key={date.format('DDDD')}
                                            style={index === 0 ? gridFirstDay(date) : undefined}
                                        >
                                            {date.isSame(currentDate.finalFinishDate) ?
                                                <div
                                                    className={`${styles.dayEl} ${styles.dayElSelected}`}
                                                    onClick={() => handleChooseDate(date)}
                                                >
                                                    {date.format('D')}
                                                </div>
                                                :
                                                <div
                                                    className={
                                                        (moment(date).isSameOrBefore(currentDate.finalStartDate) || !currentDate.finalStartDate) ?
                                                            `${styles.dayEl} ${styles.dayElDisabled}` :
                                                            `${styles.dayEl} ${styles.dayElAvailable}`
                                                    }
                                                    onClick={() => handleChooseDate(date)}>
                                                    {date.format('D')}
                                                </div>
                                            }
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};