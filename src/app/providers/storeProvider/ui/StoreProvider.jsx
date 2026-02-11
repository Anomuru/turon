import {Provider} from "react-redux";

import {createReduxStore} from "../config/store";

export const StoreProvider = (props) => {
    const { children, initialState, asyncReducers } = props;

    const store = createReduxStore(
        initialState ,
        asyncReducers,
    );



    return <Provider store={store}>{children}</Provider>;
};
