// import { QUIZ_CLEAR, QUIZ_RESTART, QUIZ_START, QUIZ_SUCCESS } from "../TypeConstants";

// const QuizReducer = (state, action) => {
//     const { type, payload } = action;

//     switch (type) {
//         case QUIZ_START:
//             return {
//                 ...state,
//                 userSelectedAnswers: [],
//                 timeTaken: 0,
//             };
//         case QUIZ_RESTART:
//             return {
//                 ...state,
//                 userSelectedAnswers: [],
//                 timeTaken: 0,
//                 attempts: ++state.attempts,
//             };
//         case QUIZ_SUCCESS:
//             return {
//                 ...state,
//                 attempts: ++state.attempts,
//             };
//         case QUIZ_CLEAR:
//             return {
//                 ...state,
//                 userSelectedAnswers: [],
//                 timeTaken: 0,
//                 attempts: 0,
//             };
//         default:
//             return state;
//     }
// }

// export default QuizReducer;
