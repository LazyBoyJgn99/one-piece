import React, { useEffect, useRef, useState } from 'react';
import BottomButtons from './components/bottom-buttons';
import TopInfos from './components/top-infos';
import './App.css';
import { ActionBtnProps } from './components/action-btn';
import useGame from './hooks/useGame';
import { FillStyle, Graphics, Sprite } from 'pixi.js';

const rewardListData = [
  [
    {
      label: 'A',
      name: '攻击力',
      text: '+1',
      num: 1,
      weight: 49,
      color: '#333333',
    },
    {
      label: 'A',
      name: '攻击力',
      text: '+2',
      num: 2,
      weight: 30,
      color: '#008000',
    },
    {
      label: 'A',
      name: '攻击力',
      text: '+3',
      num: 3,
      weight: 15,
      color: '#0000FF',
    },
    {
      label: 'A',
      name: '攻击力',
      text: '+4',
      num: 4,
      weight: 5,
      color: '#8E04A7',
    },
    {
      label: 'A',
      name: '攻击力',
      text: '+5',
      num: 5,
      weight: 1,
      // color: '#FFA500',
      color: '#FF0000',
    },
  ],
  [
    {
      label: 'H',
      name: '生命值',
      text: '+20%',
      num: 0.2,
      weight: 49,
      color: '#333333',
    },
    {
      label: 'H',
      name: '生命值',
      text: '+40%',
      num: 0.4,
      weight: 30,
      color: '#008000',
    },
    {
      label: 'H',
      name: '生命值',
      text: '+60%',
      num: 0.6,
      weight: 15,
      color: '#0000FF',
    },
    {
      label: 'H',
      name: '生命值',
      text: '+80%',
      num: 0.8,
      weight: 5,
      color: '#8E04A7',
    },
    {
      label: 'H',
      name: '生命值',
      text: '+100%',
      num: 1,
      weight: 1,
      // color: '#FFA500',
      color: '#FF0000',
    },
  ],
  [
    {
      label: 'HP',
      name: '生命上限',
      text: '+100',
      num: 100,
      weight: 49,
      color: '#333333',
    },
    {
      label: 'HP',
      name: '生命上限',
      text: '+200',
      num: 200,
      weight: 30,
      color: '#008000',
    },
    {
      label: 'HP',
      name: '生命上限',
      text: '+300',
      num: 300,
      weight: 15,
      color: '#0000FF',
    },
    {
      label: 'HP',
      name: '生命上限',
      text: '+400',
      num: 400,
      weight: 5,
      color: '#8E04A7',
    },
    {
      label: 'HP',
      name: '生命上限',
      text: '+500',
      num: 500,
      weight: 1,
      // color: '#FFA500',
      color: '#FF0000',
    },
  ],
];

/**
 * 主应用
 * @returns
 */
function App() {
  const myRef = useRef<HTMLDivElement>(null);
  const { app } = useGame({ myRef: myRef, background: '#1099bb' });
  // 生命值
  const [hp, setHp] = React.useState(100);
  const [hpMax, setHpMax] = React.useState(100);
  // 攻击力
  const [attack, setAttack] = React.useState(1);
  // 财富
  const [coin, setCoin] = React.useState(0);

  // 怪兽生命值
  const [themHp, setThemHp] = React.useState(10);
  const [themHpMax, setThemHpMax] = React.useState(10);
  // 攻击力
  const [themAttack, setThemAttack] = React.useState(1);

  // 收获时间
  const [rewardTime, setRewardTime] = useState(false);
  // 关卡
  const [level, setLevel] = useState(1);
  // 奖励列表
  const [rewardList, setRewardList] = useState<ActionBtnProps[]>([]);

  // 更强的对手
  const [stronger, setStronger] = useState(false);

  const intervalAtt = useRef<any>();

  // 一次攻击
  const attackOnce = ({ stronger }: { stronger?: boolean }) => {
    if (intervalAtt.current === undefined) {
      return null;
    }
    // 被攻击
    setHp((data) => {
      if (data - themAttack <= 0) {
        setLevel(1);
        setHp(100);
        setHpMax(100);
        setAttack(1);
        setThemHp(10);
        setThemHpMax(10);
        setThemAttack(1);
        setStronger(false);
        clearInterval(intervalAtt.current);
        intervalAtt.current = undefined;
        const num = level - 1;
        if (num < 10) {
          alert('你死啦，重新开始吧');
        } else if (num < 20) {
          alert(`击败了${num}艘海盗船，不错哦`);
        } else if (num < 50) {
          alert(`击败了${num}艘海盗船，太强啦`);
        } else if (num < 100) {
          alert(`击败了${num}艘海盗船，牛逼plus`);
        } else {
          alert(`击败了${num}艘海盗船，海贼王就是你啦`);
        }
      }
      if (stronger) {
        return data - themAttack * 2;
      }
      return data - themAttack;
    });
    // 攻击
    setThemHp((data) => {
      // 如果击败怪物
      if (data - attack <= 0) {
        resetRewardList();
        setRewardTime(true);
        setLevel(level + 1);
        setCoin(coin + 5 + level);
        setThemHpMax(themHpMax + 10);
        setThemHp(themHpMax + 10);
        setStronger(false);
        if (level % 3 === 0) {
          setThemAttack(themAttack + 2);
        }
        clearInterval(intervalAtt.current);
        intervalAtt.current = undefined;
      }
      if (stronger) {
        return data - attack / 2;
      }
      return data - attack;
    });
  };
  // 进入战斗
  const attacking = ({ stronger }: { stronger?: boolean }) => {
    intervalAtt.current = setInterval(() => {
      attackOnce({ stronger });
    }, 100);
  };
  // 计算收益列表
  const resetRewardList = () => {
    const list = rewardListData.map((item) => {
      // 总权重
      const allWeight = item.reduce((pre, cur) => {
        return pre + cur.weight;
      }, 0);
      // 抽奖
      const flagWeight = Math.random() * allWeight + 1;
      let flagReward: ActionBtnProps | undefined = undefined;
      item.reduce((pre, cur) => {
        if (!flagReward && flagWeight <= pre + cur.weight) {
          flagReward = cur;
        }
        return pre + cur.weight;
      }, 0);
      // 生成奖励
      if (!flagReward) {
        return item[0];
      }
      return flagReward;
    });
    setRewardList(list);
  };

  useEffect(() => {
    if (!app) {
      return;
    }
    const my = myBoat({ x: 50, y: app.screen.height - 150 });
    const them = myBoat({ x: app.screen.width - 150, y: 50 });
  }, [app]);

  const myBoat = ({ x, y }: { x: number; y: number }) => {
    if (!app) {
      return;
    }
    new FillStyle().color = 0xff0000;

    // create a new Sprite from an image path
    const bunny = Sprite.from('https://i.ibb.co/wrHMGz5/px-Art-3.png');
    bunny.width = 100;
    bunny.height = 100;

    // move the sprite to the center of the screen
    bunny.x = x;
    bunny.y = y;

    app.stage.addChild(bunny);

    const hpBig = new Graphics();
    hpBig.beginFill(0x000000, 0.5);
    hpBig.drawRect(x, y - 20, 100, 10);
    hpBig.beginFill(0xde2160);
    hpBig.drawRect(x, y - 20, Math.min(1, hp / hpMax) * 100, 10);
    app.stage.addChild(hpBig);

    return { obj: hpBig, x, y };
  };
  return (
    <div className="App">
      {/* 顶部信息区域 */}
      {/* TODO: */}
      <TopInfos hpMax={hpMax} attack={attack} coin={coin} />
      {/* 关卡数 */}
      <div className="level">Level. {level}</div>
      {/* 核心游戏画面 */}
      {/* TODO: */}
      {/* <div className="gameSpace" ref={myRef}></div> */}
      <div className="gameSpace">
        <div className="my">
          <div className="myHpWrap">
            <div
              className="myHp"
              style={{ width: Math.min(1, hp / hpMax) * 100 + '%' }}
            ></div>
          </div>
          <div className="myObj"></div>
        </div>
        <div className="them">
          <div className="myHpWrap">
            <div
              className="themHp"
              style={{ width: Math.min(1, themHp / themHpMax) * 100 + '%' }}
            ></div>
          </div>
          <div className="myObj"></div>
          <div className="themObjText">{stronger ? '海盗首领🏴‍☠️' : ''}</div>
        </div>
      </div>
      {/* 底部选择区域 */}
      <BottomButtons
        btnList={
          rewardTime
            ? rewardList
            : [
                { label: '1', name: '向左前进' },
                { label: '2', name: '前进' },
                { label: '3', name: '向右前进' },
              ]
        }
        onConfirm={(item) => {
          if (rewardTime) {
            if (item.label === 'A') {
              setAttack(attack + (item.num || 1));
            }
            if (item.label === 'H') {
              setHp(Math.min(hp + hpMax * (item.num || 0.2), hpMax));
            }
            if (item.label === 'HP') {
              const addHp = item.num || 100;
              setHpMax(hpMax + addHp);
              setHp(hp + addHp);
            }
            setRewardTime(false);
          }
          if (!rewardTime) {
            if (intervalAtt.current !== undefined) {
              return null;
            }
            // 运气不好增强怪兽
            const num = Math.random() * 3;
            let stronger = false;
            if (
              (num < 1 && item.label === '1') ||
              (num >= 1 && num < 2 && item.label === '2') ||
              (num >= 2 && num < 3 && item.label === '3')
            ) {
              setStronger(true);
              attacking({ stronger: true });
              return;
            }
            attacking({ stronger });
          }
        }}
      />
    </div>
  );
}

export default App;
