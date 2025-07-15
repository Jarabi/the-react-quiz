import { useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';

export default function StartScreen() {
    const { numQuestions, dispatch, categories } = useQuiz();
    const [selectedCategory, setSelectedCategory] = useState('All');

    return (
        <div className='start'>
            <h2>Welcome to the React Quiz!</h2>
            <h3>{numQuestions} questions to test your React mastery</h3>
            <div className='select-category'>
                <p>Select category</p>
                <select onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value='All'>All Categories</option>
                    {categories.map((category) => (
                        <option value={category} key={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={() =>
                    dispatch({ type: 'start', payload: selectedCategory })
                }
                className='btn btn-ui'
            >
                Let's Start
            </button>
        </div>
    );
}
