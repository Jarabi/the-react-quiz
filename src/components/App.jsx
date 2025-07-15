import Header from './Header';
import Main from '../Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import Button from './Button';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';
import { useQuiz } from '../contexts/QuizContext';
import HighScore from './HighScore';

export default function App() {
    const { status, index, numQuestions } = useQuiz();

    return (
        <div className='app'>
            <Header />
            <Main>
                {status === 'loading' && <Loader />}
                {status === 'error' && <Error />}
                {status === 'ready' && <StartScreen />}
                {status === 'active' && (
                    <>
                        <Progress />
                        <Question />
                        <Footer>
                            <Timer />
                            {index < numQuestions - 1 && (
                                <Button dispatchType='nextQuestion'>
                                    Next
                                </Button>
                            )}
                            {index === numQuestions - 1 && (
                                <Button dispatchType='finish'>Finish</Button>
                            )}
                        </Footer>
                    </>
                )}
                {status === 'finished' && <FinishScreen />}
                {status === 'review' && (
                    <>
                        <Progress />
                        <HighScore />
                        <Question />
                        <Footer>
                            <div className='review-btns'>
                                <div className='review-nav'>
                                    <Button
                                        dispatchType='reviewPrev'
                                        disabled={index === 0}
                                    >
                                        Previous
                                    </Button>

                                    <Button
                                        dispatchType='reviewNext'
                                        disabled={index === numQuestions - 1}
                                    >
                                        Next
                                    </Button>
                                </div>
                                <Button dispatchType='restart'>
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
