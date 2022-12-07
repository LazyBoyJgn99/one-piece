import React from 'react';
import './action-btn.css';
import classNames from 'classnames';

export interface ActionBtnProps {
  active?: boolean;
  name?: string;
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
  num,
  key,
  ...props
}: ActionBtnProps) {
  const { className } = props;
  return (
    <div
      className={classNames('actionBtn', active && 'active', className)}
      {...props}
    >
      <div className="actionBtnName">{name}</div>
      <div className="actionBtnNum">{num}</div>
      {active && <div className="confirm">确认</div>}
    </div>
  );
}

export default ActionBtn;
