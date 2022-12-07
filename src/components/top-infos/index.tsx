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
        <span>hp: </span>
        {hpMax}
      </div>
      <div className="topInfosItem">
        <span>attack: </span>
        {attack}
      </div>
      <div className="topInfosItem">
        <span>coin: </span>
        {coin}
      </div>
    </div>
  );
}

export default TopInfos;
