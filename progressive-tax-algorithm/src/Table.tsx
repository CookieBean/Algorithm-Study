import React, { useEffect, useRef, useState } from 'react';
import './Table.scss';
import TableItem from './TableItem';
import axios from 'axios';
import Loading from './Loading';

function Table({ week }: { week: number }) {
  const [userList] = useState([
    { id: 'hyeonho28', tier: 'p' },
    { id: 'no13song', tier: 'g' },
    { id: 'kkomul1', tier: 'g' },
    { id: 'gwonllna', tier: 'g' },
    { id: 'tjfzjarlatlgus', tier: 'g' },
    { id: 'always216', tier: 'g' },
    { id: 'mjhee2647', tier: 's' },
    { id: 'lumicode', tier: 'g' },
    { id: 'theolee72', tier: 's' },
    { id: 'jungyun01', tier: 's' },
  ]);
  // const userList = [{ id: 'hyeonho28', tier: 'p' }];
  const [data, setData] = useState<Data[]>([]);
  const [load, setLoad] = useState(true);
  const [totalProblemList, setTotalProblemList] = useState<TotalProblem[]>([]);

  // const baseURI = 'https://progressive-tax-algorithm.fly.dev';
  const baseURI = 'http://localhost:5000';

  function useDidUpdateEffect(fn: any, inputs: any) {
    const isMountingRef = useRef(false);

    useEffect(() => {
      isMountingRef.current = true;
    }, []);

    useEffect(() => {
      if (!isMountingRef.current) {
        return fn();
      } else {
        isMountingRef.current = false;
      }
    }, inputs);
  }

  useDidUpdateEffect(() => {
    if (week > 0 && totalProblemList.length < week) {
      const qweek = totalProblemList.length + 1;
      axios
        .get(baseURI + '/problem/' + qweek, {
          withCredentials: true,
        })
        .then((res) => {
          setTotalProblemList((tpl: TotalProblem[]) => {
            return [...tpl, { week: qweek, problems: res.data }];
          });
        })
        .catch((err) => {
          setTotalProblemList((tpl: TotalProblem[]) => {
            return [...tpl, { week: qweek, problems: [] }];
          });
        });
    } else {
      setData([{ week: 1, data: { index: 0, data: [] } }]);
    }
  }, [totalProblemList]);

  useEffect(() => {
    console.log(week);
    setLoad(true);
    setTotalProblemList([]);
  }, [week]);

  useDidUpdateEffect(() => {
    if (
      userList.length === 10 &&
      week > 0 &&
      totalProblemList.length >= week &&
      data.length > 0 &&
      data.length <= week
    ) {
      const ind = data.length - 1;
      if (data[ind].data.index >= 0 && data[ind].data.index < userList.length) {
        const ele = userList[data[ind].data.index];
        try {
          axios
            .get(baseURI + '/submit/' + data[ind].week + '/' + ele.id, {
              withCredentials: true,
            })
            .then((res) => {
              const row = totalProblemList[data[ind].week - 1].problems.map(
                (elem) => {
                  const filtered: Submit[] = res.data.filter(
                    (element: Submit) => {
                      return Number(element.problemID) === elem.id;
                    },
                  );
                  if (
                    filtered.filter((element: Submit) => {
                      return element['submitResult'] === 'ac';
                    }).length > 0
                  ) {
                    return 'ac';
                  } else {
                    if (filtered.length === 0) return '';
                    return filtered[0]['submitResult'];
                  }
                },
              );
              setData(
                data.map((d: Data, i: number) => {
                  if (i === ind) {
                    return {
                      week: d.week,
                      data: {
                        index: d.data.index + 1,
                        data: [
                          ...d.data.data,
                          { user: ele, submitResult: row },
                        ],
                      },
                    };
                  } else {
                    return d;
                  }
                }),
              );
            })
            .catch((err) => {
              console.log(err);
              setData(
                data.map((d: Data, i: number) => {
                  if (i === ind) {
                    return {
                      week: d.week,
                      data: {
                        index: d.data.index + 1,
                        data: [...d.data.data, { user: ele, submitResult: [] }],
                      },
                    };
                  } else {
                    return d;
                  }
                }),
              );
            });
        } catch (e) {
          console.log(e);
          setData(
            data.map((d: Data, i: number) => {
              if (i === ind) {
                return {
                  week: d.week,
                  data: {
                    index: d.data.index + 1,
                    data: [...d.data.data, { user: ele, submitResult: [] }],
                  },
                };
              } else {
                return d;
              }
            }),
          );
        }
      } else {
        if (ind + 1 < week) {
          setData((dd: Data[]) => {
            return [
              ...dd,
              { week: data[ind].week + 1, data: { index: 0, data: [] } },
            ];
          });
        } else {
          setLoad(false);
        }
      }
    }
  }, [data]);

  return (
    <section className="ftco-section">
      <div className="container">
        {load ? (
          <Loading />
        ) : (
          <div className="row">
            <div className="col-md-12">
              <div className="table-wrap">
                <table className="table table-responsive-xl">
                  <thead>
                    <tr>
                      <th>Handle</th>
                      {totalProblemList.length >= week ? (
                        totalProblemList[week - 1].problems.map((ele) => {
                          return (
                            <th key={ele.id}>
                              <a
                                href={`https://www.acmicpc.net/problem/${ele.id}`}
                                target="_blank"
                              >
                                {ele.id}
                              </a>
                            </th>
                          );
                        })
                      ) : (
                        <></>
                      )}
                      <th className="table-space left">&nbsp;</th>
                      <th className="table-space">&nbsp;</th>
                      <th className="table-tax">누진세</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length >= week ? (
                      data[week - 1].data.data.map((ele) => {
                        return (
                          <TableItem
                            user={ele['user']}
                            submitResult={ele['submitResult']}
                            tpl={totalProblemList}
                            data={data}
                            week={week}
                            key={ele['user'].id}
                          />
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Table;
