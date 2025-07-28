import {configureStore} from '@reduxjs/toolkit';
import {createReducerManager} from './reducerManager';
import {useHttp} from "shared/api/base";
import {oftenUsedReducer} from "entities/oftenUsed";
import {loginReducer} from "pages/loginPage";
import {userProfileReducer} from "entities/profile/userProfile";
import {studentsReducer} from "entities/students/model/studentsSlice.js";
import {userSliceReducer} from "pages/registerPage/model/registerSlice.js";


export function createReduxStore(
    initialState,
    asyncReducers,
) {
    const rootReducers = {
        ...asyncReducers,
        // user: userReducer,
        oftenUsedSlice: oftenUsedReducer,
        loginSlice: loginReducer,
        userProfileSlice: userProfileReducer,
        newStudents: studentsReducer,
        userSlice: userSliceReducer


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

