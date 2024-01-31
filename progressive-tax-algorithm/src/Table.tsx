import React, { useEffect, useState } from 'react';
import './Table.scss';
import TableItem from './TableItem';
import axios from 'axios';

function Table({ week }: { week: number }) {
  const userList = [
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
  ];
  // const userList = [{ id: 'hyeonho28', tier: 'p' }];
  // const problemList = [
  //   1309, 9278, 16132, 1735, 23048, 15897, 30194, 23041, 2673, 3012,
  // ];
  const [data, setData] = useState<Data[]>([]);
  const [init, setInit] = useState(true);
  const [problemList, setProblemList] = useState<Problem[]>([]);
  const [totalProblemList, setTotalProblemList] = useState<TotalProblem[]>([]);

  useEffect(() => {
    axios
      .get('https://progressive-tax-algorithm.fly.dev/problem/' + week, {
        withCredentials: true,
      })
      .then((res) => {
        setProblemList(res.data);
      })
      .catch((err) => {
        setProblemList([]);
      });
  }, [week]);

  useEffect(() => {
    if (totalProblemList.length < week) {
      const qweek = totalProblemList.length + 1;
      axios
        .get('https://progressive-tax-algorithm.fly.dev/problem/' + qweek, {
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
    }
  }, [totalProblemList]);

  useEffect(() => {
    if (totalProblemList.length >= week)
      setData([{ week: 1, data: { index: 0, data: [] } }]);
  }, [totalProblemList]);

  useEffect(() => {
    if (data.length > 0 && data.length <= week) {
      const ind = data.length - 1;
      if (data[ind].data.index >= 0 && data[ind].data.index < userList.length) {
        const ele = userList[data[ind].data.index];
        try {
          axios
            .get(
              'https://progressive-tax-algorithm.fly.dev/submit/' +
                data[ind].week +
                '/' +
                ele.id,
              {
                withCredentials: true,
              },
            )
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
        }
      }
    }
  }, [data]);

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="table-wrap">
              <table className="table table-responsive-xl">
                <thead>
                  <tr>
                    <th>Handle</th>
                    {problemList ? (
                      problemList.map((ele) => {
                        return <th>{ele.id}</th>;
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
                          problemList={problemList}
                          week={week}
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
      </div>
    </section>
  );
}

export default Table;
