import React from 'react';
import './action-btn.css';
import classNames from 'classnames';

export interface ActionBtnProps {
  active?: boolean;
  name?: string;
  text?: string;
  num?: number;
  color?: string;
  label?: string;
  [s: string]: any;
}
/**
 * 底部按钮
 * @param props
 * @returns
 */
function ActionBtn({
  active,
  label,
  name,
  text,
  num,
  color,
  ...props
}: ActionBtnProps) {
  const { className } = props;
  return (
    <div
      className={classNames('actionBtn', active && 'active', className)}
      {...props}
      style={{ color: color }}
    >
      <div className="actionBtnName">{name}</div>
      <div className="actionBtnNum">{text}</div>
      {active && <div className="confirm">确认</div>}
    </div>
  );
}

export default ActionBtn;
