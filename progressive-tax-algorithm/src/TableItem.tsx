import React, { useEffect, useState } from 'react';
import styles from './TableItem.module.scss';

function TableItem({
  user,
  submitResult,
  tpl,
  data,
  week,
}: {
  user: User;
  submitResult: string[];
  tpl: TotalProblem[];
  data: Data[];
  week: number;
}) {
  // const resType = ['ac', 'tle', 'wa', 'pac', 'pac', 'rte'];
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
    if (week > 0 && filtered.length > 0) {
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
  }, [filtered, stack, week]);

  return (
    <tr className={styles['alert']} role="alert">
      <td className={styles['handle-' + user.tier]}>{user.id}</td>
      {submitResult.map((ele, ind) => {
        return (
          <td className={styles['status']} key={ind}>
            <span className={styles[ele]}>{ele.toUpperCase()}</span>
          </td>
        );
      })}
      <td className={styles['table-space-left']}>&nbsp;</td>
      <td className={styles['table-space']}>&nbsp;</td>
      <td
        className={styles['table-tax']}
        style={{ color: `rgb(${getTax(stack.val) / 140}, 0, 0)` }}
      >
        {getTax(stack.val) + '원'}
      </td>
    </tr>
  );
}

export default TableItem;
