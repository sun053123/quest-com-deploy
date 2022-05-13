import { QUIZ_START, QUIZ_RESTART, QUIZ_SUCCESS, QUIZ_CLEAR } from "../TypeConstants";

export const QuizStart = () => ({
    type: QUIZ_START
});

export const QuizRestart = (payload) => ({
    type: QUIZ_RESTART,
    payload
});

export const QuizSuccess = (payload) => ({
    type: QUIZ_SUCCESS,
    payload
});

export const QuizClear = () => ({
    type: QUIZ_CLEAR
});


