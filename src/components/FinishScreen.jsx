import { useQuiz } from '../contexts/QuizContext';
import Button from './Button';

export default function FinishScreen() {
    const { points, totalPoints, highScore, dispatch } = useQuiz();
    const percentage = (points / totalPoints) * 100;
    let emoji;

    if (percentage === 100) emoji = '🥇';
    if (percentage >= 80 && percentage < 100) emoji = '🥳';
    if (percentage >= 50 && percentage < 80) emoji = '😃';
    if (percentage > 0 && percentage < 50) emoji = '🫣';
    if (percentage === 0) emoji = '👎';

    return (
        <>
            <p className='result'>
                <span>{emoji}</span>You scored <strong>{points}</strong> out of{' '}
                {totalPoints} ({Math.ceil(percentage)}%)
            </p>
            <p className='highscore'>(Highscore: {highScore} points)</p>
            <div className='finish-buttons'>
                <Button dispatch={dispatch} dispatchType='review'>
                    Review
                </Button>
                <Button dispatch={dispatch} dispatchType='restart'>
                    Restart Quiz
                </Button>
            </div>
        </>
    );
}
