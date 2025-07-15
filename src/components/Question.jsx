import { useQuiz } from '../contexts/QuizContext';
import Options from './Options';

export default function Question() {
    const { questions, index } = useQuiz();
    const question = questions.at(index);

    return (
        <div>
            <span className='badge'>{question.category}</span>
            <h4>{question.question}</h4>
            <Options question={question} />
        </div>
    );
}
