import { configureStore } from '@reduxjs/toolkit';
import { activitiesSlice, authSlice, customersSlice, dashboardSlice, dealsSlice, leadsSlice, uiSlice } from './';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        customers: customersSlice.reducer,
        leads: leadsSlice.reducer,
        deals: dealsSlice.reducer,
        activities: activitiesSlice.reducer,
        dashboard: dashboardSlice.reducer,
        ui: uiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
