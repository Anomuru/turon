
import cls from "./calendar.module.sass"
import {Table} from "../../../../shared/ui/table";
import {months} from "../../../../pages/calendarPage/ui/calendarDetail";
import {useContext, useEffect, useRef} from "react";
import {HomeContext} from "../../../../shared/lib/context/homeContext";

export const Calendar = () => {
    const {setSectionTop} = useContext(HomeContext)

    const sectionRef = useRef()

    useEffect(() => {
        setSectionTop(cur => ({...cur, academic_calendar: sectionRef?.current?.offsetTop}))
    }, [setSectionTop])

    const render = () => {
        return months.map(item => (
            <div className={cls.inner}>
                <div className={cls.inner_title}>
                    {item.name}
                </div>
                <div className={cls.table}>
                    <Table>
                        <thead>
                        <tr>
                            {/*<th/>*/}
                            <th>Mon</th>
                            <th>Tu</th>
                            <th>W</th>
                            <th>TH</th>
                            <th>F</th>
                            <th>Sa</th>
                            <th>Su</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            {/*<td/>*/}
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                            <td>7</td>
                        </tr>
                        <tr>
                            {/*<td/>*/}
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                            <td>7</td>
                        </tr>
                        <tr>
                            {/*<td/>*/}
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                            <td>7</td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        ))
    }
    return (
        <div ref={sectionRef}>
            <div className={cls.calendarHeader}>
                <h1 className={cls.calendarHeader__titleMain}>Academic Calendar</h1>

                <div className={cls.calendarHeader__title}>
                    <i className="far fa-calendar-alt"/>
                    <h2>2023-2024 years calendar</h2>
                </div>
            </div>
           <div className={cls.calendar}>

                   {render()}

           </div>

        </div>
    );
};


