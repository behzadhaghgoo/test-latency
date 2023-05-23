import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // import CSS file

function App() {
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [delayTime, setDelayTime] = useState(5);
  const [isFocused, setIsFocused] = useState(false);
  const [startTypingTime, setStartTypingTime] = useState(0);
  const [actualDelay, setActualDelay] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [autocompleteSuggestion, setAutocompleteSuggestion] = useState('');
  const [autocompleteStartTime, setAutocompleteStartTime] = useState(0);
  const [autocompleteDelay, setAutocompleteDelay] = useState(0);

  const inputRef = useRef();

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDisplayValue(inputValue);
      setActualDelay(Date.now() - startTypingTime);
    }, delayTime);

    return () => clearTimeout(timerId);
  }, [inputValue, delayTime, startTypingTime]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setShowCursor(show => !show);
    }, 500);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const autocompleteTimerId = setTimeout(() => {
      if (inputValue === 'test') {
        setAutocompleteSuggestion('ing autocomplete');
        setAutocompleteStartTime(Date.now());
      } else {
        setAutocompleteSuggestion('');
        setAutocompleteStartTime(0);
        setAutocompleteDelay(0);
      }
    }, 500);

    return () => clearTimeout(autocompleteTimerId);
  }, [inputValue]);

  useEffect(() => {
    if (autocompleteStartTime !== 0) {
      setAutocompleteDelay(Date.now() - autocompleteStartTime);
    }
  }, [autocompleteStartTime]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100" onClick={() => {setIsFocused(false)}}>
      <div>
       <label htmlFor="delayTime" className="text-sm text-gray-500">Set delay time (ms): </label>
        <input
          id="delayTime"
          className="border border-gray-300 p-2 w-full mb-4 rounded"
          type="number"
          min="0"
          value={delayTime}
          onChange={(e) => setDelayTime(Number(e.target.value))}
        />
      </div>
      <div
        className={`bg-white p-6 rounded-lg shadow-lg cursor-text ${isFocused ? "bg-orange-100" : ""} `}
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current.focus();
          setIsFocused(true);
        }}
      >
        <input
          ref={inputRef}
          className="opacity-0 absolute"
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setStartTypingTime(Date.now());
          }}
        />
        {isFocused ? (
          <>
            <p className={`h-4 text-gray-500 ${isFocused ? "cursor-text" : ""}`}>
              {displayValue}
              {autocompleteSuggestion && <>{autocompleteSuggestion}</>}
              <span className={isFocused && showCursor ? "cursor" : ""}></span>
            </p>
            <p className="mt-4 text-gray-500">Actual delay: {actualDelay} ms</p>
            {autocompleteStartTime !== 0 && (
              <p className="mt-2 text-gray-500">Autocomplete delay: {autocompleteDelay} ms</p>
            )}
          </>
        ) : (
          <p className={`h-4 text-gray-500 ${isFocused ? "cursor-text" : ""}`}>
            Click here to start typing...
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
