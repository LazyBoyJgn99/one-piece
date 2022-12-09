import React, { useEffect, useRef, useState } from 'react';
import BottomButtons from './components/bottom-buttons';
import TopInfos from './components/top-infos';
import { ActionBtnProps } from './components/action-btn';
import useGame from './hooks/useGame';
import { FillStyle, Graphics, Sprite, Text } from 'pixi.js';

import './App.css';


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
  // 用于canvas渲染
  const gameState = useRef({
    my: {
      hp: 100,
      hpMax: 100,
      attack: 1,
    },
    them: {
      hp: 10,
      hpMax: 10,
      attack: 1,
      stronger: false
    },
    coin: 0,
    level: 1,
    attacking: false
  })
  // 用于dom渲染
  const [gameRenderState, setGameRenderState] = useState(gameState.current)

  // 收获时间
  const [rewardTime, setRewardTime] = useState(false);
  // 关卡
  const [level, setLevel] = useState(1);
  // 奖励列表
  const [rewardList, setRewardList] = useState<ActionBtnProps[]>([]);


  // 一次攻击
  const attackOnce = () => {
    // 被攻击
    if (gameState.current.them.stronger) {
      gameState.current.my.hp -= gameState.current.them.attack * 2;
    } else {
      gameState.current.my.hp -= gameState.current.them.attack;
    }
    // 计算死亡
    if (gameState.current.my.hp <= 0) {
      if (gameState.current.level < 10) {
        alert('你死啦，重新开始吧');
      } else if (gameState.current.level < 20) {
        alert(`击败了${gameState.current.level}艘海盗船，不错哦`);
      } else if (gameState.current.level < 50) {
        alert(`击败了${gameState.current.level}艘海盗船，太强啦`);
      } else if (gameState.current.level < 100) {
        alert(`击败了${gameState.current.level}艘海盗船，牛逼plus`);
      } else {
        alert(`击败了${gameState.current.level}艘海盗船，海贼王就是你啦`);
      }
      setLevel(1);
      gameState.current.level = 1;
      gameState.current.my.hp = 100
      gameState.current.my.hpMax = 100
      gameState.current.my.attack = 1
      gameState.current.them.hp = 10
      gameState.current.them.hpMax = 10
      gameState.current.them.attack = 1
      gameState.current.them.stronger = false
      gameState.current.attacking = false
      richText.text = '';
      richText.updateText(true)
      return;
    }
    // 攻击
    if (gameState.current.them.stronger) {
      gameState.current.them.hp -= gameState.current.my.attack / 2;
    } else {
      gameState.current.them.hp -= gameState.current.my.attack;
    }
    // 如果击败怪物
    if (gameState.current.them.hp <= 0) {
      resetRewardList();
      setRewardTime(true);
      setLevel(level + 1);
      gameState.current.level++;
      gameState.current.coin += 5 + level;
      gameState.current.them.hpMax += 10;
      gameState.current.them.hp = gameState.current.them.hpMax;
      gameState.current.them.stronger = false;
      richText.text = ''
      richText.updateText(true)

      if (gameState.current.level % 3 === 0) {
        gameState.current.them.attack += 2;
      }
      gameState.current.attacking = false;
    }
    // 刷新页面
    setGameRenderState(gameState.current)
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
  const timer = useRef(0);
  const myHpRender = useRef<{
    obj: Graphics;
    x: number;
    y: number;
  }>();
  const richText = new Text('');
  useEffect(() => {
    if (!app) {
      return;
    }

    const my = createBoat({ x: 50, y: app.screen.height - 150, color: 0x1cf639 });
    myHpRender.current = my;
    const them = createBoat({ x: app.screen.width - 150, y: 50, color: 0xde2160 });
    richText.x = app.screen.width - 150;
    richText.y = 150;
    app.stage.addChild(richText)
    app.ticker.add(() => {
      timer.current++;
      if (my) {
        draw({ ...my, name: 'my' })
      }
      if (!gameState.current.attacking) {
        return;
      }
      if (timer.current % 7 === 0) {
        attackOnce();
        if (my) {
          draw({ ...my, name: 'my' })
        }
        if (them) {
          draw({ ...them, name: 'them' })
        }
        timer.current = 1;
      }
    })
  }, [app]);

  const draw = ({ obj, x, y, name }: { obj: Graphics, x: number, y: number, name: 'my' | 'them' }) => {
    obj.clear();
    obj.beginFill(0x000000, 0.5);
    obj.drawRect(x, y - 20, 100, 10);
    if (name === 'my') {
      obj.beginFill(0x1cf639);
    } else {
      obj.beginFill(0xde2160);
    }
    obj.drawRect(x, y - 20, Math.min(1, gameState.current[name].hp / gameState.current[name].hpMax) * 100, 10);
  }
  const createBoat = ({ x, y, color }: { x: number; y: number, color: 0x1cf639 | 0xde2160 }) => {
    console.log('createBoat')
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
    hpBig.beginFill(color);
    hpBig.drawRect(x, y - 20, Math.min(1, gameState.current.my.hp / gameState.current.my.hpMax) * 100, 10);
    app.stage.addChild(hpBig);

    return { obj: hpBig, x, y };
  };
  return (
    <div className="App">
      {/* 顶部信息区域 */}
      {/* TODO: */}
      <TopInfos hpMax={gameRenderState.my.hpMax} attack={gameRenderState.my.attack} coin={gameRenderState.coin} />
      {/* 关卡数 */}
      <div className="level">Level. {gameRenderState.level}</div>
      {/* 核心游戏画面 */}
      {/* TODO: */}
      <div className="gameSpace" ref={myRef}></div>
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
          console.log(gameState.current.attacking)
          if (rewardTime) {
            if (item.label === 'A') {
              gameState.current.my.attack += (item.num || 1);
            }
            if (item.label === 'H') {
              gameState.current.my.hp = Math.min(gameState.current.my.attack + gameState.current.my.hpMax * (item.num || 0.2), gameState.current.my.hpMax)
            }
            if (item.label === 'HP') {
              const addHp = item.num || 100;
              gameState.current.my.hpMax += addHp;
              gameState.current.my.hp += addHp;
            }
            setGameRenderState(gameState.current)
            setRewardTime(false);
            console.log('myHpRender.current', myHpRender.current)
            if (myHpRender.current) {
              draw({ ...myHpRender.current, name: 'my' })
            }
          }
          if (!rewardTime) {
            console.log(gameState.current.attacking)

            if (gameState.current.attacking === true) {
              return null;
            }
            // 运气不好增强怪兽
            const num = Math.random() * 3;
            if (
              (num < 1 && item.label === '1') ||
              (num >= 1 && num < 2 && item.label === '2') ||
              (num >= 2 && num < 3 && item.label === '3')
            ) {
              gameState.current.them.stronger = true;
              richText.text = '海岛首领'
              richText.updateText(true)
            }
            gameState.current.attacking = true;
          }
        }}
      />
    </div>
  );
}

export default App;
