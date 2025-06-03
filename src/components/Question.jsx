import Options from "./Options";

export default function Question({ question, dispatch, answer }) {
    const {question: q, options} = question;
    
    return (
        <div>
            <h4>{q}</h4>
            <Options question={question} options={options} dispatch={dispatch} answer={answer} />
        </div>
    )
}
