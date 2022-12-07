import React, { useState } from 'react';
import ActionBtn, { ActionBtnProps } from '../action-btn';
import './bottom-buttons.css';

/**
 * 底部按钮队列
 */
function BottomButtons({
  btnList,
  onConfirm,
}: {
  btnList: ActionBtnProps[];
  onConfirm: (p: ActionBtnProps) => void;
}) {
  // 底部按钮选中状态
  const [selectedBtn, setSelectedBtn] = useState<string>('');
  return (
    <div className="bottomButtons">
      {btnList.map((item, i) => {
        const active = selectedBtn === item.label;
        return (
          <ActionBtn
            key={i}
            onClick={() => {
              // 第一次点击
              if (!active) {
                setSelectedBtn(item.label || '');
                return;
              }
              // 第二次点击
              onConfirm(item);
              // 重置选中状态
              setSelectedBtn('');
            }}
            active={active}
            {...item}
          />
        );
      })}
    </div>
  );
}

export default BottomButtons;
