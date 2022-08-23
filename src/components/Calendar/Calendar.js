import styles from './Calendar.module.css';
import {
    addMonth,
    getWeeks,
    gridFirstDay,
    isBeforeOrSameDate,
    subtractMonth,
    yearFromNow,
    getDaysNumbers,
    isLastDayOfMonth
} from "../../helpers/datepicker.variables";
import {useEffect, useMemo, useState} from "react";
import moment from 'moment';
import {useDispatch, useSelector} from "react-redux";
import 'moment/locale/he';
import {dateActions} from "../../store/actions/date.actions";

export const Calendar = (props) => {
    const dispatch = useDispatch();
    const storedDate = useSelector(state => state.dateReducer);
    const [showDropdown, setShowDropdown] = useState(false);
    const [days, setDays] = useState([]);
    const [daysFinish, setDaysFinish] = useState([]);


    const yearFromNowMemo = useMemo(() => yearFromNow(storedDate.dateNow), [storedDate.dateNow]);

    const lastAvailable = (selectedDate) => {
        return selectedDate.isSameOrAfter(yearFromNowMemo[yearFromNowMemo.length - 1])
    }

    const firstAvailableStart = (selectedDate) => {
        return selectedDate.isSameOrBefore(storedDate.dateNow) || selectedDate.isSame(storedDate.dateNow, 'month');
    }

    const firstAvailableFinish = (finish, start) => {
        return isBeforeOrSameDate(finish, start) ||
            finish.isSame(start, 'month') ||
            (storedDate.finalStartDate && isLastDayOfMonth(storedDate.finalStartDate)
                && subtractMonth(storedDate.finishDate).isSame(storedDate.startDate));
    };

    useEffect(() => {
        setDays(getDaysNumbers(storedDate.startDate));
        setDaysFinish(getDaysNumbers(storedDate.finishDate));
    }, [storedDate]);

    useEffect(() => {
        if (storedDate.startDate.isAfter(storedDate.finishDate)) {
            dispatch(dateActions.setFinishDate(storedDate.startDate));
        }
        if (storedDate.finalStartDate && isLastDayOfMonth(storedDate.finalStartDate) && storedDate.finishDate.isSame(storedDate.startDate, 'months')) {
            dispatch(dateActions.setFinishDate(addMonth(storedDate.startDate)));
        }
    })

    useEffect(() => {
        if (storedDate.finalFinishDate
            && storedDate.finalStartDate
            && storedDate.finalStartDate.isSameOrAfter(storedDate.finalFinishDate)) {
            dispatch(dateActions.deleteFinishDate());
        }
    });

    const handleOpenMonthsPicker = () => {
        setShowDropdown(prev => !prev);
    };

    const handleClickBack = () => {
        if (props.initial) {
            dispatch(dateActions.setStartDate(subtractMonth(storedDate.startDate)));
        } else {
            dispatch(dateActions.setFinishDate(subtractMonth(storedDate.finishDate)));
        }
    };

    const handleClickForward = () => {
        if (props.initial) {
            dispatch(dateActions.setStartDate(addMonth(storedDate.startDate)));
        } else {
            dispatch(dateActions.setFinishDate(addMonth(storedDate.finishDate)));
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
            if (date.isSame(storedDate.finalStartDate)) {
                dispatch(dateActions.deleteStartDate());
                dispatch(dateActions.deleteFinishDate());
                return;
            }
            dispatch(dateActions.setFinalStartDate(date));
        } else {
            if (date.isSame(storedDate.finalFinishDate)) {
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
                                disabled={firstAvailableStart(storedDate.startDate)}
                                className={`${styles.rightArrowBtn}`}
                                onClick={handleClickBack}>
                            <div
                                className={firstAvailableStart(storedDate.startDate) ?
                                    `${styles.arrowIcon} ${styles.arrowIconDisabled}` : `${styles.arrowIcon}`}/>
                        </button>
                        :
                        <button type="button"
                                disabled={firstAvailableFinish(storedDate.finishDate, storedDate.startDate)}
                                className={`${styles.rightArrowBtn}`}
                                onClick={handleClickBack}>
                            <div
                                className={firstAvailableFinish(storedDate.finishDate, storedDate.startDate) ?
                                    `${styles.arrowIcon} ${styles.arrowIconDisabled}` : `${styles.arrowIcon}`}/>
                        </button>
                    }


                    <div className={styles.pickerInputContainer} onClick={handleOpenMonthsPicker}>
                        <input readOnly className={styles.pickerInput} type="text"
                               value={props.initial ?
                                   storedDate.startDate.format(`MMMM YYYY`) :
                                   storedDate.finishDate.format(`MMMM YYYY`)}
                        />
                        <span className={styles.dropdownIcon}/>

                        {showDropdown &&
                            <div className={styles.openedWrapper}>
                                <div className={styles.dropdownContainer}>
                                    <div className={styles.dropdownFirstRow}>
                                        <input readOnly
                                               className={`${styles.pickerInput} ${styles.pickerInputDropdown}`}
                                               type="text"
                                               value={props.initial ?
                                                   storedDate.startDate.format(`MMMM YYYY`) :
                                                   storedDate.finishDate.format(`MMMM YYYY`)}
                                        />
                                        <span className={`${styles.dropdownIcon} ${styles.dropdownIconUp}`}/>
                                    </div>
                                    <div className={styles.dropdownListContainer}>
                                        {
                                            yearFromNow(storedDate.dateNow).map(month => (
                                                props.initial ?
                                                    <button key={month.format(`MMMM YYYY`)}
                                                            type='button'
                                                            onClick={() => handleChooseMonth(month)}
                                                            className={styles.dropdownItem}>{month.format(`MMMM YYYY`)}
                                                    </button>
                                                    :
                                                    <button key={month.format(`MMMM YYYY`)}
                                                            type='button'
                                                            disabled={month.isBefore(storedDate.startDate) ||
                                                                (isLastDayOfMonth(storedDate.finalStartDate) && storedDate.finalStartDate.isSame(month, 'month'))}
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
                                disabled={lastAvailable(storedDate.startDate)}
                                className={`${styles.leftArrowBtn} ${styles.rightArrowBtn}`}
                                onClick={handleClickForward}>
                            <div
                                className={lastAvailable(storedDate.startDate) ?
                                    `${styles.arrowIcon} ${styles.arrowIconDisabled}` : `${styles.arrowIcon}`}/>
                        </button> :
                        <button type="button"
                                disabled={lastAvailable(storedDate.finishDate)}
                                className={`${styles.leftArrowBtn} ${styles.rightArrowBtn}`}
                                onClick={handleClickForward}>
                            <div
                                className={lastAvailable(storedDate.finishDate) ?
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
                                            style={index === 0 ? gridFirstDay(date) : undefined}>
                                            {date.isSame(storedDate.finalStartDate) ?
                                                <div
                                                    className={`${styles.dayEl} ${styles.dayElSelected}`}
                                                    onClick={() => handleChooseDate(date)}>
                                                    {date.format('D')}
                                                </div>
                                                :
                                                <div
                                                    className={
                                                        moment(date).isBefore(storedDate.dateNow) ?
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
                                            style={index === 0 ? gridFirstDay(date) : undefined}>

                                            {date.isSame(storedDate.finalFinishDate) ?
                                                <div
                                                    className={`${styles.dayEl} ${styles.dayElSelected}`}
                                                    onClick={() => handleChooseDate(date)}>
                                                    {date.format('D')}
                                                </div>
                                                :
                                                <div
                                                    className={
                                                        (moment(date).isSameOrBefore(storedDate.finalStartDate) || !storedDate.finalStartDate) ?
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