import { useQuiz } from '../contexts/QuizContext';

export default function HighScore() {
    const { points, totalPoints, highScore } = useQuiz();
    return (
        <p className='highscore'>
            Score: {points} / {totalPoints} (
            {Math.ceil((points / totalPoints) * 100)}%){' '}
            <span className='badge accent'>Highscore: {highScore} points</span>
        </p>
    );
}
