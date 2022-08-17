import {useState} from "react";
import {useSelector} from "react-redux";
import styles from './Datepicker.module.css';
import {Calendar} from "../Calendar/Calendar";


export const Datepicker = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    const pickedDate = useSelector(state => state.dateReducer);


    const handleOpenCalender = () => {
        setShowCalendar(prev => !prev);
    };

    const dateSet = (pickedDate.finalStartDate && pickedDate.finalFinishDate) &&
        <div className={styles.showDates}>
            <p> תאריך התחלה: {pickedDate.finalStartDate.toDate().toString()}</p>
            <p> תאריך סיום: {pickedDate.finalFinishDate.toDate().toString()}</p>
        </div>;

    return (
        <div className={styles.mainWrap}>
            <div className={styles.mainTitle}>
                <h1>Date picker</h1>
            </div>
            <div className={styles.pickerContainer}>
                <div onClick={handleOpenCalender}>
                    <input readOnly placeholder='Choose date' className={styles.inputPicker} type="text"/>
                    <span className={styles.calendarIcon}/>
                </div>
                {showCalendar && <div className={styles.calendarContainer}>
                    <div className={styles.calendarWrap}>
                        <div className={styles.closeButtonContainer}>
                            <div onClick={handleOpenCalender} className={styles.closeButton}/>
                        </div>
                        <div className={styles.startFinishContainer}>
                            <Calendar
                                initial
                                title="תאריך יציאה"

                            />
                            <hr className={styles.calendarsBorder}/>
                            <Calendar
                                title="תאריך חזרה"
                            />
                        </div>
                    </div>
                </div>
                }
            </div>
            {dateSet}
        </div>
    )
};