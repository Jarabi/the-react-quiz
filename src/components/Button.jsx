export default function Button({ dispatch, dispatchType, disabled, answer, children }) {
    const mustHaveAnswer = new Set(['nextQuestion', 'finish']);

    if (mustHaveAnswer.has(dispatchType) && answer === null) return null;

    return <button className="btn btn-ui" onClick={() => dispatch({ type: dispatchType})} disabled={disabled}>{children}</button>
}