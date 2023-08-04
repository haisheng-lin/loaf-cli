import axios from 'axios';
import { Table } from 'console-table-printer';

interface Fund {
  code: string;
  name: string;
  netWorth: number;
  evaluatedNetWorth: number;
  rise: number;
  updatedAt: string;
}

async function getFund(id: string) {
  try {
    const response = await axios.get(
      `https://fundgz.1234567.com.cn/js/${id}.js`
    );
    const regMatchArray = response.data.match(/\{.*\}/);
    if (!regMatchArray) {
      return;
    }
    const [fundStr] = regMatchArray;
    const fund = JSON.parse(fundStr);
    return {
      code: fund.fundcode,
      name: fund.name,
      netWorth: Number(fund.dwjz), // 单位净值
      evaluatedNetWorth: Number(fund.gsz), // 估算净值
      rise: Number(fund.gszzl),
      updatedAt: fund.gztime
    } as Fund;
  } catch (e) {
    console.error(e);
  }
}

function printFunds(funds: Fund[]) {
  const table = new Table({
    columns: [
      {
        name: 'code',
        title: '代码',
        alignment: 'center',
        color: 'white'
      },
      {
        name: 'name',
        title: '名称',
        alignment: 'center',
        color: 'white'
      },
      {
        name: 'netWorth',
        title: '单位净值',
        alignment: 'center',
        color: 'white'
      },
      {
        name: 'evaluatedNetWorth',
        title: '估算净值',
        alignment: 'center',
        color: 'white'
      },
      {
        name: 'rise',
        title: '估算涨幅',
        alignment: 'center'
      },
      {
        name: 'updatedAt',
        title: '更新时间',
        alignment: 'center',
        color: 'white'
      }
    ]
  });

  for (const fund of funds) {
    table.addRow(fund, {
      color: fund.rise > 0 ? 'red' : fund.rise < 0 ? 'green' : 'white'
    });
  }

  table.printTable();
}

export default async function () {
  const fundIDs = [
    '161725',
    '110003',
    '161724',
    '161726',
    '004997',
    '005669',
    '400015',
    '519674',
    '163406',
    '005827',
    '003095',
    '001938',
    '270002'
  ];
  const funds = await Promise.all(fundIDs.map(id => getFund(id)));
  printFunds(funds as Fund[]);
}
