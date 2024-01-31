import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import styles from './Main.module.scss';
import axios from 'axios';
import Table from './Table';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import Loading from './Loading';

function Main() {
  const [result, setResult] = useState('');
  const [week, setWeek] = useState(0);
  const { param } = useParams();
  const [time, setTime] = useState(new Date()); // {Math.floor(time.getTime() / 1000)}

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  useEffect(() => {
    const cur = Math.floor(
      (Math.floor(time.getTime() / 1000) - 1705244400) / 604800,
    );
    setWeek(
      !isNaN(Number(param)) && Number(param) <= cur + 1
        ? Number(param)
        : cur + 1,
    );
  }, [param]);

  useEffect(() => {
    console.log(week);
  }, [week]);

  return (
    <>
      <div className={styles['content']}>
        <div className={styles['text-head']}>
          {week}
          주차 스터디
        </div>
        <div className={styles['text-body']}>
          {time.toLocaleString('ko-KR', {
            dateStyle: 'full',
            timeStyle: 'medium',
            hour12: true,
          })}
        </div>
      </div>
      {week > 0 && <Table week={Number(week)}></Table>}
      <div className={styles['text-body']}>Designed By @CookieBean</div>
    </>
  );
}

export default Main;
