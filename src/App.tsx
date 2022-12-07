import React, { useEffect, useRef, useState } from 'react';
import BottomButtons from './components/bottom-buttons';
import TopInfos from './components/top-infos';
import './App.css';

/**
 * 主应用
 * @returns
 */
const App = () => {
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

  const intervalAtt = useRef<any>();
  const attackOnce = () => {
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
        clearInterval(intervalAtt.current);
        intervalAtt.current = undefined;
        if (level < 10) {
          alert('你死啦，重新开始吧');
        } else if (level < 20) {
          alert(`击败了${level}艘海盗船，不错哦`);
        } else if (level < 50) {
          alert(`击败了${level}艘海盗船，太强啦`);
        } else {
          alert(`击败了${level}艘海盗船，海贼王就是你啦`);
        }
      }
      return data - themAttack;
    });
    // 攻击
    setThemHp((data) => {
      if (data - attack <= 0) {
        setRewardTime(true);
        setLevel(level + 1);
        setCoin(coin + 5 + level);
        setThemHpMax(themHpMax + 10);
        setThemHp(themHpMax + 10);
        if (level % 5 === 0) {
          setThemAttack(themAttack + 1);
        }
        clearInterval(intervalAtt.current);
        intervalAtt.current = undefined;
      }
      return data - attack;
    });
  };
  const attacking = () => {
    intervalAtt.current = setInterval(() => {
      attackOnce();
    }, 100);
  };
  useEffect(() => {}, [themHp]);

  return (
    <div className="App">
      {/* 顶部信息区域 */}
      {/* TODO: */}
      <TopInfos hpMax={hpMax} attack={attack} coin={coin} />
      {/* 关卡数 */}
      <div className="level">Level. {level}</div>
      {/* 核心游戏画面 */}
      {/* TODO: */}
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
        </div>
      </div>
      {/* 底部选择区域 */}
      <BottomButtons
        btnList={
          rewardTime
            ? [
                { label: '1', name: '攻击力', num: '+1' },
                { label: '2', name: '生命值', num: '+20%' },
                { label: '3', name: '生命上限', num: '+100' },
              ]
            : [
                { label: '1', name: '向左前进', num: '' },
                { label: '2', name: '前进', num: '' },
                { label: '3', name: '向右前进', num: '' },
              ]
        }
        onConfirm={(item) => {
          console.log('intervalAtt.current ', intervalAtt.current);
          console.log(
            'intervalAtt.current !== undefined',
            intervalAtt.current !== undefined
          );
          if (rewardTime) {
            if (item.label === '1') {
              setAttack(attack + 1);
            }
            if (item.label === '2') {
              setHp(Math.min(hp + hpMax * 0.2, hpMax));
            }
            if (item.label === '3') {
              setHpMax(hpMax + 100);
              setHp(hp + 100);
            }
            setRewardTime(false);
          }
          if (!rewardTime) {
            if (intervalAtt.current !== undefined) {
              return null;
            }
            attacking();
          }
          console.log(item);
        }}
      />
    </div>
  );
};

export default App;
