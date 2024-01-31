import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import styles from './TableItem.module.scss';
import { getValue } from '@testing-library/user-event/dist/utils';

function TableItem({
  user,
  submitResult,
  problemList,
  tpl,
  data,
  week,
}: {
  user: User;
  submitResult: string[];
  problemList: Problem[];
  tpl: TotalProblem[];
  data: Data[];
  week: number;
}) {
  // const resType = ['ac', 'tle', 'wa', 'pac', 'pac', 'rte'];
  const resType = 'ac';
  const [stack, setStack] = useState({ val: 0, ind: -1 });
  const [filtered, setFiltered] = useState<Calc[]>([]);

  const getTax = (val: number) => {
    return new Array(val)
      .fill(0)
      .map((ele, index) => {
        if (index <= 1) return 1000;
        else if (index <= 3) return 3000;
        else if (index <= 5) return 6000;
        else return 10000;
      })
      .reduce((acc, cur) => acc + cur, 0);
  };

  useEffect(() => {
    if (week > 0 && tpl.length >= week && data.length >= week && user.id) {
      setFiltered(
        tpl.map((ele: TotalProblem, ind: number) => {
          const neccessary = ele.problems.filter(
            (ele, index) =>
              !ele.isChallenge &&
              data[ind].data.data.filter((e) => e.user.id === user.id)[0]
                .submitResult[index] !== 'ac',
          ).length;
          const challenge = ele.problems.filter(
            (ele, index) =>
              ele.isChallenge &&
              data[ind].data.data.filter((e) => e.user.id === user.id)[0]
                .submitResult[index] === 'ac',
          ).length;
          if (ind === 0) return { neccessary: neccessary, challenge: 0 };
          return { neccessary: neccessary, challenge: challenge };
        }),
      );
    }
  }, [tpl, data, user.id, week]);

  useEffect(() => {
    if (filtered.length > 0) setStack({ val: 0, ind: 0 });
  }, [filtered]);

  useEffect(() => {
    if (week > 0) {
      if (1 <= stack.ind + 1 && stack.ind + 1 <= week) {
        setStack({
          ind: stack.ind + 1,
          val:
            stack.val +
              filtered[stack.ind].neccessary -
              filtered[stack.ind].challenge >
            0
              ? stack.val +
                filtered[stack.ind].neccessary -
                filtered[stack.ind].challenge
              : 0,
        });
      }
    }
  }, [stack, week]);

  useEffect(() => {
    if (user.id === 'jungyun01') console.log(stack);
  }, [stack]);

  return (
    <tr className={styles['alert']} role="alert">
      <td className={styles['handle-' + user.tier]}>{user.id}</td>
      {submitResult.map((ele) => {
        return (
          <td className={styles['status']}>
            <span className={styles[ele]}>{ele.toUpperCase()}</span>
          </td>
        );
      })}
      <td className={styles['table-space-left']}>&nbsp;</td>
      <td className={styles['table-space']}>&nbsp;</td>
      <td
        className={styles[getTax(stack.val) > 0 ? 'table-tax-d' : 'table-tax']}
      >
        {(getTax(stack.val) > 0 ? getTax(stack.val) : 0) + '원'}
      </td>
    </tr>
  );
}

export default TableItem;
