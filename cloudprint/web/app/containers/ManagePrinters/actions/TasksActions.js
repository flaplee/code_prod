import { RECEIVE_TASKS, SET_TASKS_PAGE } from '../constants/TasksTypes';

export const receiveTasks = json => ({
  type: RECEIVE_TASKS,
  value: json.data,
});

export const setTasksPage = value => ({
  type: SET_TASKS_PAGE,
  value: parseInt(value, 10),
});
