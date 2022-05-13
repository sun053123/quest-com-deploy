// import React, { useEffect, createContext, useReducer } from 'react'

// import  QuizReducer  from '../Reducers/QuizReducer';

// const INITIAL_QUIZ_STATE = {
//     userSelectedAnswers: [],
//     timeTaken: 0,
//     attempts: 0,
// }

// localStorage.setItem("quiz", JSON.stringify(INITIAL_QUIZ_STATE));

// const QuizContext = createContext(INITIAL_QUIZ_STATE);

// export const QuizProvider = ({ children }) => {
//     const [state, QuizDispatch] = useReducer(QuizReducer, INITIAL_QUIZ_STATE);

//     //set quiz to local storage
//     useEffect(() => {
//         localStorage.setItem("quiz", JSON.stringify(state));
//     }
//         , [state]);

//     return (
//         <QuizContext.Provider value={{ 
//             userSelectedAnswers: state.userSelectedAnswers,
//             timeTaken: state.timeTaken,
//             attempts: state.attempts,
//             QuizDispatch: QuizDispatch,
//          }}>
//             {children}
//         </QuizContext.Provider>
//     );
// }
import { linearProgressClasses } from '@mui/material';
import React, { createContext, useContext, useState, useEffect } from 'react'


export const stateContext = createContext();

const getFreshContext = () => {
    if (localStorage.getItem('quiz') === null)
        localStorage.setItem('quiz', JSON.stringify({
            attempts: 0,
            timeTaken: 0,
            selectedOptions: []
        }))
    return JSON.parse(localStorage.getItem('quiz'))
}

export default function useStateQuizContext() {
    const { quizcontext, setQuizContext } = useContext(stateContext)
    return {
        quizcontext,
        setQuizContext: obj => { 
            setQuizContext({ ...quizcontext, ...obj }) },
        resetContext: ()=>{
            localStorage.removeItem('quiz')
            setQuizContext(getFreshContext())
        }
    };
}

export function QuizContextProvider({ children }) {
    const [quizcontext, setQuizContext] = useState(getFreshContext())

    useEffect(() => {
        localStorage.setItem('quiz', JSON.stringify(quizcontext))
    }, [quizcontext])

    return (
        <stateContext.Provider value={{ quizcontext, setQuizContext }}>
            {children}
        </stateContext.Provider>
    )
}