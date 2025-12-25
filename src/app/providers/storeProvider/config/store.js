import {configureStore} from '@reduxjs/toolkit';
import teacherAttendanceSlice from "entities/teacherAttendance/model/teacherAttendanceSlice.js";
import {parentsProfileReducer} from "features/parentsProfile/model/parentsProfileSlice.js";
import {createReducerManager} from './reducerManager';
import {useHttp} from "shared/api/base";
import {oftenUsedReducer} from "entities/oftenUsed";
import {loginReducer} from "pages/loginPage";
import {userProfileReducer} from "entities/profile/userProfile";
import {studentsReducer} from "entities/students/model/studentsSlice.js";
import {userSliceReducer} from "pages/registerPage/model/registerSlice.js";
import {
    vacancyPageParseReducer,

} from "features/vacancyModals/vacancyPageAdd/model/vacancyPageParseSlice.js";
import {taskManagerReducer} from "features/taskManager/modal/taskManagerSlice.js";
import {calendarReducer} from "pages/calendarPage/model/calendarSlice.js";
import {teacherReducer} from "entities/teachers/model/teacherSlice.js";
import {groupsReducer} from "entities/groups/model/slice/groupsSlice.js";
import {groupProfileReducer} from "entities/profile/groupProfile/model/groupProfileSlice.js";
import {groupAttendanceReducer} from "pages/profilePage/model/slice/groupAttendanceSlice.js";
import {teacherParseReducer, teacherParseSlice} from "entities/teachers/model/teacherParseSlice.js";
import {teacherSalaryReducer, teacherSalarySlice} from "entities/teacherSalary/ui/teacherSalarySlice.js";
import {timeTableReducer} from "pages/timeTableListPage/model/timeTableListSlice/timeTableListSlice.js";
import {employerCategoryReducer, employerCategorySlice} from "entities/employer/model/slice/employerCategory.js";
import {searchReducer} from "features/searchInput";
import {rgbReducer} from "entities/rgbData/model/rgbDataSlice.js";
import {roomsReducer} from "entities/rooms/index.js";
import {studentPaymentReducer} from "features/studentPayment/model/studentPaymentSlice.js";
import {studentProfileReducer} from "pages/profilePage/model/slice/studentProfileSlice.js";
import {AlertReducer} from "features/alert/model/slice/alertSlice.js";
import {timeTableTuronReducer} from "pages/timeTable/model/slice/timeTableTuronSlice.js";
import {filterLeadsReducers} from "entities/filteredLeadsList/model/filteredLeadsListSlice.js";
import {quarterMasterReducer} from "pages/quarterMasterPage/model/quarterMasterSlice.js";
import {locationsReducer} from "features/locations/model/slice/locationsSlice.js";
import {parentReducer} from "entities/parents/model/parentSlice.js";


export function createReduxStore(
    initialState,
    asyncReducers,
) {
    const rootReducers = {
        ...asyncReducers,
        alertSlice: AlertReducer,
        // user: userReducer,
        oftenUsedSlice: oftenUsedReducer,
        loginSlice: loginReducer,
        userProfileSlice: userProfileReducer,
        searchSlice: searchReducer,

        newStudents: studentsReducer,
        userSlice: userSliceReducer,
        vacancyPageParseSlice: vacancyPageParseReducer,
        taskManagerSlice: taskManagerReducer,
        calendarSlice: calendarReducer,
        teachersSlice: teacherReducer,
        groupsSlice: groupsReducer,
        groupProfileSlice: groupProfileReducer,
        groupAttendance: groupAttendanceReducer,
        teacherParseSlice: teacherParseReducer,
        teacherSalarySlice:teacherSalaryReducer,
        TimeTableSlice: timeTableReducer,
        employerCategorySlice: employerCategoryReducer,
        rgbSlice: rgbReducer,
        roomsSlice: roomsReducer,
        studentPaymentSlice: studentPaymentReducer,
        studentProfileSlice: studentProfileReducer,
        timeTableTuronSlice: timeTableTuronReducer,
        filteredLeadsListSlice: filterLeadsReducers,
        quarterMasterSlice: quarterMasterReducer,
        locationsSlice: locationsReducer,
        parentSlice: parentReducer,
        parentsProfileSlice: parentsProfileReducer,
        teacherAttendanceSlice




    };

    const reducerManager = createReducerManager(rootReducers);

    const {request} = useHttp()


    const extraArg = {
        api: request,
    };

    const store = configureStore({
        reducer: reducerManager.reduce,
        devTools: true,
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: extraArg,
                },
            }),
    });

    store.reducerManager = reducerManager;

    return store;
}

