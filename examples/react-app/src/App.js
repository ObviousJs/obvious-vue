import React from 'react';
import logo from './logo.svg';
import './App.css';

const bus = window.__Bus__.host;
const socket = bus.createSocket();

function App() {
  const [text, setText] = React.useState('Hello Obvious');
  const [logoClass, setLogoClass] = React.useState('App-logo rotate');
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (socket.getState('text') === undefined) {
      socket.initState('text', 'Hello Obvious');
    } else {
      socket.setState('text', 'Hello Obvious');
    }
    const changeRotate = (rotate) => {
      if (rotate) {
        setLogoClass('App-logo rotate');
      } else {
        setLogoClass('App-logo');
      }
    };
    const getInputDom = () => {
      return inputRef && inputRef.current;
    };
    socket.onBroadcast('change-rotate', changeRotate);
    socket.onUnicast('get-input-dom', getInputDom);
    return () => {
      socket.offBroadcast('change-rotate', changeRotate);
      socket.offUnicast('get-input-dom', getInputDom);
    };
  }, []);

  const handleOnChange = (e) => {
    setText(e.target.value);
    socket.setState('text', e.target.value);
  }

  const handleOnHide = () => {
    socket.broadcast('setReactAreaVisible', false)
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={`http://localhost:3000${logo}`} className={logoClass} alt="logo" />
        <div>
            <div>Edit the text showed in vue area: </div>
            <input ref={inputRef} onChange={handleOnChange} value={text}></input>
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleOnHide}>Hide React App</button>
        </div>
      </header>
    </div>
  );
}

export default App;
