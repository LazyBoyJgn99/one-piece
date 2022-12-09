import { useEffect, useState } from 'react';
import { Application } from 'pixi.js';
import type { IApplicationOptions, ICanvas } from 'pixi.js';

export interface IUseGameOptions extends IApplicationOptions {
  myRef: React.RefObject<HTMLDivElement>;
}

const useGame = ({ myRef, ...rest }: IUseGameOptions) => {
  const [app, setApp] = useState<Application<ICanvas>>();

  useEffect(() => {
    // 调试时会触发2次useEffect
    if (myRef?.current?.innerHTML) {
      return;
    }
    // 默认获取容器的宽高
    const width = rest?.width || myRef?.current?.clientWidth;
    const height = rest?.height || myRef?.current?.clientHeight;
    const myApp = new Application({ ...rest, width, height });
    setApp(myApp);
    // @ts-ignore 此处app.view: ICanvas未被定义为Node，引发TS报错，可忽略
    myRef?.current?.appendChild(myApp.view);
  }, []);

  return {
    app,
  };
};

export default useGame;
