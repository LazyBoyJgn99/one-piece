import './App.css';
import ActionBtn from './components/action-btn';

const App = () => {
  return (
    <div className="App">
      {/* 顶部信息区域 */}
      {/* 核心游戏画面 */}
      {/* 底部选择区域 */}
      <div className="bottomButtons">
        {[1, 2, 3].map((item) => (
          <ActionBtn key={item} />
        ))}
      </div>
    </div>
  );
};

export default App;
