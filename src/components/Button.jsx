import { useQuiz } from '../contexts/QuizContext';

export default function Button({ dispatchType, disabled, children }) {
    const { dispatch, answer } = useQuiz();
    const mustHaveAnswer = new Set(['nextQuestion', 'finish']);

    if (mustHaveAnswer.has(dispatchType) && answer === null) return null;

    return (
        <button
            className='btn btn-ui'
            onClick={() => dispatch({ type: dispatchType })}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
