import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import styles from './App.module.scss';
import axios from 'axios';
import Table from './Table';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import Main from './Main';

function App() {
  const [result, setResult] = useState('');
  const [time, setTime] = useState(new Date()); // {Math.floor(time.getTime() / 1000)}

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  return (
    <Routes>
      <Route path="/:param" element={<Main />} />
      <Route path="*" element={<Main />} />
    </Routes>
  );
}

export default App;
