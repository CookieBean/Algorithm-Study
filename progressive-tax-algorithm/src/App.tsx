import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import styles from './App.module.scss';
import axios from 'axios';
import Table from './Table';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
    <div className={styles['App']}>
      <div className={styles['App-header']}>
        <BrowserRouter>
          <Routes>
            <Route path="/:param" element={<Main />} />
            <Route path="*" element={<Main />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
