/* App.jsx - 주소와 화면을 연결한다

   지금까지는 화면이 하나뿐이었다. 이제 주소에 따라 다른 화면을 보여준다.

     /              -> 목록
     /pokemon/25    -> 25번 상세
     그 외           -> 없는 주소 안내 */

import { Routes, Route, Link } from 'react-router';
import ListPage from './pages/ListPage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
    return (
        <div className="app">
            <header className="header">
                {/* Link 는 <a> 와 달리 페이지를 새로 받아오지 않는다.
                    주소만 바꾸고 React 가 화면을 갈아 끼운다. 그래서 상태가 살아 있다. */}
                <Link to="/"><h1>포켓몬 도감</h1></Link>
            </header>

            <Routes>
                <Route path="/" element={<ListPage />} />

                {/* ── TODO 1. Route 세 개 ──
                    :id 는 자리표시자다. 실제 값은 DetailPage 에서 useParams 로 꺼낸다. */}
                <Route path="/pokemon/:id" element={<DetailPage />} />

                {/* * 는 위의 어느 것에도 맞지 않는 주소를 받는다. 마지막에 둔다. */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    );
}

export default App;
