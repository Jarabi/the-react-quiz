import { useEffect, useReducer } from 'react'
import Header from './Header'
import Main from '../Main'
import Loader from './Loader';
import Error from './Error'
import StartScreen from './StartScreen';
import Question from './Question';
import Button from './Button';
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
            answers,
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
                            {index < numQuestions - 1 && (
                                <Button
                                    dispatch={dispatch}
                                    dispatchType='nextQuestion'
                                    answer={answer}
                                >
                                    Next
                                </Button>
                            )}
                            {index === numQuestions - 1 && (
                                <Button
                                    dispatch={dispatch}
                                    dispatchType='finish'
                                    answer={answer}
                                >
                                    Finish
                                </Button>
                            )}
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
                {status === 'review' && (
                    <>
                        <Progress
                            index={index}
                            numQuestions={numQuestions}
                            points={points}
                            totalPoints={totalPoints}
                            answer={answer}
                        />
                        <p className='highscore'>
                            Score: {points} / {totalPoints} (
                            {Math.ceil((points / totalPoints) * 100)}%){' '}
                            <span className='badge accent'>
                                Highscore: {highScore} points
                            </span>
                        </p>
                        <Question
                            question={questions[index]}
                            dispatch={dispatch}
                            answer={answers[index]}
                        />
                        <Footer>
                            <div className='review-btns'>
                                <div className='review-nav'>
                                    <Button
                                        dispatch={dispatch}
                                        dispatchType='reviewPrev'
                                        disabled={index === 0}
                                    >
                                        Previous
                                    </Button>

                                    <Button
                                        dispatch={dispatch}
                                        dispatchType='reviewNext'
                                        disabled={index === numQuestions - 1}
                                    >
                                        Next
                                    </Button>
                                </div>
                                <Button
                                    dispatch={dispatch}
                                    dispatchType='restart'
                                >
                                    Restart Quiz
                                </Button>
                            </div>
                        </Footer>
                    </>
                )}
            </Main>
        </div>
    );
}

const initialState = {
    allQuestions: [],
    questions: [],
    status: 'loading', // 'loading', 'error', 'ready', 'active', 'finished', 'review'
    index: 0,
    answer: null,
    answers: [], // Srores all user answers
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
            // Create new answer array with the current answer
            const newAnswers = [...state.answers];
            newAnswers[state.index] = action.payload;

            return {
                ...state,
                answer: action.payload,
                answers: newAnswers,
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
            // const newHighScore = state.points > state.highScore ? state.points : state.highScore;
            const newHighScore = Math.max(state.points, state.highScore);

            // Update high score in API
            fetch('http://localhost:8000/highScore', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ highScore: newHighScore }),
            }).catch((error) =>
                console.error('Error updating high score in API:', error)
            );

            return {
                ...state,
                status: 'finished',
                highScore: newHighScore,
            };
        }

        case 'review': {
            // Review answered questions
            return {
                ...state,
                status: 'review',
                index: 0, // Start from the first question
            };
        }

        case 'reviewNext': {
            return {
                ...state,
                index: state.index + 1,
            };
        }

        case 'reviewPrev': {
            return {
                ...state,
                index: state.index - 1,
            };
        }

        case 'restart': {
            // Fetch the latest high score from API during restart
            fetch('http://localhost:8000/highScore')
                .then((response) => response.json())
                .then((data) => (state.highScore = data.highScore))
                .catch((error) =>
                    console.error('Error fetching high score from API:', error)
                );

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