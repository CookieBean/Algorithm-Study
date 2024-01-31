type Problem = {
  id: number;
  tier: string;
  isChallenge: boolean;
};

type Try = {
  tryCount: number;
  penalty: number;
};

type User = {
  id: string;
  tier: string;
};

type Submit = {
  problemID: string;
  submitID: string;
  submitResult: string;
  submitTime: string;
}

type CurrentSubmit = {
  user: User;
  submitResult: string[];
}

type Data = {
  week: number;
  data: {
    index: number;
    data: CurrentSubmit[];
  }
}

type TotalProblem = {
  week: number;
  problems: Problem[];
}

type Calc = {
  neccessary: number;
  challenge: number;
}