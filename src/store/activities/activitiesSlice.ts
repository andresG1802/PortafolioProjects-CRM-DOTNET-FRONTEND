import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity } from '../../types';

interface ActivitiesState {
    isLoadingActivities: boolean;
    activities: Activity[];
    activeActivity: Activity | null;
}

const initialState: ActivitiesState = {
    isLoadingActivities: true,
    activities: [],
    activeActivity: null,
};

export const activitiesSlice = createSlice({
    name: 'activities',
    initialState,
    reducers: {
        onSetActivities: (state, { payload }: PayloadAction<Activity[]>) => {
            state.isLoadingActivities = false;
            state.activities = payload;
        },
        onAddActivity: (state, { payload }: PayloadAction<Activity>) => {
            state.activities.push(payload);
        },
        onUpdateActivity: (state, { payload }: PayloadAction<Activity>) => {
            state.activities = state.activities.map((activity) => (activity.id === payload.id ? payload : activity));
        },
        onDeleteActivity: (state, { payload }: PayloadAction<string>) => {
            state.activities = state.activities.filter((activity) => activity.id !== payload);
        },
        onSetActiveActivity: (state, { payload }: PayloadAction<Activity>) => {
            state.activeActivity = payload;
        },
        onClearActiveActivity: (state) => {
            state.activeActivity = null;
        },
    },
});

export const {
    onSetActivities,
    onAddActivity,
    onUpdateActivity,
    onDeleteActivity,
    onSetActiveActivity,
    onClearActiveActivity,
} = activitiesSlice.actions;
