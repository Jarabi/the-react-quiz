import { useEffect, useReducer } from 'react'
import Header from './Header'
import Main from '../Main'
import Loader from './Loader';
import Error from './Error'
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';

const SECONDS_PER_QUESTION = 30;

export default function App() {
    const [
        {
            allQuestions,
            questions,
            status,
            index,
            answer,
            points,
            highScore,
            secondsRemaining,
        },
        dispatch,
    ] = useReducer(reducer, initialState);

    // Derived state
    const numQuestions = questions.length;
    const totalPoints = questions.reduce((acc, curr) => acc + curr.points, 0);
    const categories = [
        ...new Set(allQuestions.map((question) => question.category)),
    ];

    useEffect(function () {
        fetch('http://localhost:8000/questions')
            .then((res) => res.json())
            .then((data) => dispatch({ type: 'dataReceived', payload: data }))
            .catch((err) => dispatch({ type: 'dataFailed', payload: err }));
    }, []);

    return (
        <div className='app'>
            <Header />
            <Main>
                {status === 'loading' && <Loader />}
                {status === 'error' && <Error />}
                {status === 'ready' && (
                    <StartScreen
                        numQuestions={numQuestions}
                        dispatch={dispatch}
                        categories={categories}
                    />
                )}
                {status === 'active' && (
                    <>
                        <Progress
                            index={index}
                            numQuestions={numQuestions}
                            points={points}
                            totalPoints={totalPoints}
                            answer={answer}
                        />
                        <Question
                            question={questions[index]}
                            dispatch={dispatch}
                            answer={answer}
                        />
                        <Footer>
                            <Timer
                                secondsRemaining={secondsRemaining}
                                dispatch={dispatch}
                            />
                            <NextButton
                                dispatch={dispatch}
                                answer={answer}
                                index={index}
                                numQuestions={numQuestions}
                            />
                        </Footer>
                    </>
                )}
                {status === 'finished' && (
                    <FinishScreen
                        points={points}
                        totalPoints={totalPoints}
                        highScore={highScore}
                        dispatch={dispatch}
                    />
                )}
            </Main>
        </div>
    );
}

const initialState = {
    allQuestions: [],
    questions: [],
    status: 'loading', // 'loading', 'error', 'ready', 'active', 'finished'
    index: 0,
    answer: null,
    points: 0,
    highScore: 0,
    secondsRemaining: null,
};

function reducer(state, action) {
    const question = state.questions.at(state.index);

    switch (action.type) {
        case 'dataReceived': {
            return {
                ...state,
                allQuestions: action.payload,
                questions: action.payload,
                status: 'ready',
            };
        }

        case 'dataFailed': {
            return {
                ...state,
                status: 'error',
            };
        }

        case 'start': {
            const filteredQuestions =
                action.payload === 'All'
                    ? state.allQuestions
                    : state.allQuestions.filter(
                          (q) => q.category === action.payload
                      );

            return {
                ...state,
                status: 'active',
                questions: filteredQuestions,
                secondsRemaining:
                    filteredQuestions.length * SECONDS_PER_QUESTION,
            };
        }

        case 'tick': {
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status:
                    state.secondsRemaining === 0 ? 'finished' : state.status,
            };
        }

        case 'newAnswer': {
            return {
                ...state,
                answer: action.payload,
                points:
                    action.payload === question.correctOption
                        ? state.points + question.points
                        : state.points,
            };
        }

        case 'nextQuestion': {
            return { ...state, index: state.index + 1, answer: null };
        }

        case 'finish': {
            return {
                ...state,
                status: 'finished',
                highScore:
                    state.points > state.highScore
                        ? state.points
                        : state.highScore,
            };
        }

        case 'restart': {
            return {
                ...initialState,
                allQuestions: state.allQuestions,
                questions: state.allQuestions,
                highScore: state.highScore,
                status: 'ready',
            };
        }

        default:
            throw new Error('Action unknown');
    }
}