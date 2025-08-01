import { ReactNode, useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';


export const DynamicModuleLoader = (props) => {
    const { children, reducers, removeAfterUnmount = true } = props;

    const store = useStore() ;
    const dispatch = useDispatch();

    useEffect(() => {
        const mountedReducers = store.reducerManager.getMountedReducers();

        Object?.entries(reducers)?.forEach(([name, reducer]) => {
            const mounted = mountedReducers[name ];
            if (!mounted) {
                store?.reducerManager?.add(name, reducer);
                dispatch({ type: `@INIT ${name} reducer` });
            }
        });

        return () => {
            if (removeAfterUnmount) {
                Object.entries(reducers).forEach(([name, reducer]) => {
                    store.reducerManager.remove(name );
                    dispatch({ type: `@DESTROY ${name} reducer` });
                });
            }
        };
    }, []);

    return (
        <>{children}</>
    );
};
