import React from 'react';
import './top-infos.css';

export interface TopInfosProps {
  hpMax?: number;
  attack?: number;
  coin?: number;
  [s: string]: any;
}
/**
 * 顶部信息区域
 * @returns
 */
function TopInfos(props: TopInfosProps) {
  const { hpMax = 0, attack = 0, coin = 0 } = props;
  return (
    <div className="topInfos">
      <div className="topInfosItem">
        <span>生命: </span>
        {hpMax}
      </div>
      <div className="topInfosItem">
        <span>攻击: </span>
        {attack}
      </div>
      <div className="topInfosItem">
        <span>悬赏: </span>
        {coin}
      </div>
    </div>
  );
}

export default TopInfos;
