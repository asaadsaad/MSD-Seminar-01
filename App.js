import { createContext, useContext, useReducer } from 'react';
const CalcContext = createContext(null);


const CalcScreen = () => {
  const { state } = useContext(CalcContext);
  return (
    <p>{state.current.n1 && state.current.n1} &nbsp;
      {state.current.operation && state.current.operation} &nbsp;
      {state.current.n2 && state.current.n2}
      {state.current.result && ' = ' + state.current.result}</p>
  )
}

const History = () => {
  const { state } = useContext(CalcContext)
  return (
    state.history.map((historyObject, i) => <div key={i}>{historyObject.n1} {historyObject.operation} {historyObject.n2} = {historyObject.result}</div>)
  )
}

const CalcButtons = () => {
  const { handleNumber, handleOperation, handleResults, handleReset } = useContext(CalcContext)

  return (
    <>
      <button onClick={() => handleNumber(1)}>1</button>
      <button onClick={() => handleNumber(2)}>2</button>
      <button onClick={() => handleNumber(3)}>3</button>
      <button onClick={() => handleOperation('ADD')}>+</button>
      <button onClick={handleResults}>=</button>
      <button onClick={handleReset}>Reset</button>
    </>
  )
}
// const state = {
//   current: {n1: number, n2: number, operation: string, result: number}
//   history: [
//         {n1: number, n2: number, operation: string, result: number}, 
//         {n1: number, n2: number, operation: string, result: number}
//         ]
//   }

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_N1': return { ...state, current: { ...state.current, n1: action.payload } };
    case 'SET_N2': return { ...state, current: { ...state.current, n2: action.payload } };
    case 'SET_OPERATION': return { ...state, current: { ...state.current, operation: action.payload } };
    case 'SET_RESULT': return { ...state, current: { ...state.current, result: action.payload } };
    case 'PUSH_TO_HISTORY': return {
      ...state,
      history: [...state.history, state.current]
    };
    case 'RESET': return { ...state, current: { n1: 0, n2: 0, operation: '', result: 0 } };
    default: return state;
  }
}



function App() {
  const [state, dispatch] = useReducer(reducer, {
    current: { n1: 0, n2: 0, operation: '', result: 0 },
    history: []
  })

  const handleNumber = (n) => {
    if (!state.current.n1) {
      dispatch({
        type: 'SET_N1',
        payload: n
      })
    } else {
      dispatch({
        type: 'SET_N2',
        payload: n
      })
    }
  }
  const handleOperation = (op) => {
    dispatch({
      type: 'SET_OPERATION',
      payload: op
    })
  }
  const handleResults = () => {
    // calculate and set result
    if (state.current.operation === 'ADD') {
      const result = state.current.n1 + state.current.n2;
      dispatch({
        type: 'SET_RESULT',
        payload: result
      })
    }
    // push to history
    dispatch({
      type: 'PUSH_TO_HISTORY',
    })
  }
  const handleReset = () => {
    dispatch({
      type: 'RESET',
    })
  }
  return (
    <CalcContext.Provider value={{ state, handleNumber, handleOperation, handleResults, handleReset }}>
      <div className="App">
        <CalcScreen />
        <CalcButtons />
        <History />
      </div>
    </CalcContext.Provider>

  );
}

export default App;
