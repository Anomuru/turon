import React, {useEffect, useRef, useState} from 'react';
import cls from './alert.module.sass';
import {useDispatch, useSelector} from "react-redux";
import {getAlerts} from "features/alert/model/selectors/alertSelectors";
import {onDeleteAlert} from "features/alert/model/slice/alertSlice";
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import classNames from "classnames";

import "./alert.css"

const alertTypes = {
    error: 'error',
    success: 'success',
    warning: 'warning'
};

export const Alert = () => {

    // const [canDelete, setCanDelete] = useState(false)

    const alertsData = useSelector(getAlerts)



    // useEffect(() => {
    //     setAlerts(alertsData)
    // }, [alertsData])

    // useEffect(() => {
    //
    //     if (alerts.length) {
    //         for (let i = 0; i >  alerts.length; i++) {
    //             setTimeout(() => {
    //                 dispatch(onDeleteAlert({index: i}))
    //             }, 500);
    //         }
    //     }
    // }, [alerts])




    // const stopDeleting = () => {
    //     setCanDelete(false)
    // }
    //
    // const continueDeleting = () => {
    //     setCanDelete(true)
    // }


    return (
        <div className={cls.alerts}>

            {alertsData?.map((alert, index) => (
                <AlertItem  alert={alert} index={index}/>
            ))}
        </div>
        //
        // <TransitionGroup
        //     className={cls.alerts}
        // >

        // </TransitionGroup>


    )

};


const AlertItem = React.memo(({alert, index}) => {



    const nodeRef = useRef(null);
    const dispatch = useDispatch()

    const hideAlert = (index) => {
        dispatch(onDeleteAlert({index}))

        // setTimeout(() => {
        //
        // }, 500);

    };


    useEffect(() => {
        // Use setTimeout to update the message after 2000 milliseconds (2 seconds)


        const timeoutId = setTimeout(() => {
            dispatch(onDeleteAlert({index}))
        }, (index+1) *3000);

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [alert]);




    return (
        <CSSTransition
            in={alert.status}
            nodeRef={nodeRef}
            timeout={400}
            classNames="alert"
            unmountOnExit
        >
            <div
                ref={nodeRef}
                key={index}
                className={classNames(cls.alert, cls[alert.type])}

            >
                <p>{alert.msg}</p>
                <i className="fa-solid fa-xmark" onClick={() => hideAlert(index)}></i>
            </div>
         </CSSTransition>
    )
})