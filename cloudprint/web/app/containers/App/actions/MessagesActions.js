import { ADD_MESSAGES } from '../constants/MessagesTypes';

export const addMessages = value => ({
  type: ADD_MESSAGES,
  value,
});
