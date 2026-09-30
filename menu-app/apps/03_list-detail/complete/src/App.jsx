/* App.jsx - 메뉴 관리 화면의 주소와 컴포넌트를 연결한다. */

import { Link, Route, Routes } from 'react-router';
import DetailPage from './pages/DetailPage.jsx';
import ListPage from './pages/ListPage.jsx';
import MenuFormPage from './pages/MenuFormPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
    return (
        <div className="app">
            <header className="header">
                <Link to="/"><h1>메뉴 관리</h1></Link>
                <nav>
                    <Link to="/">메뉴 목록</Link>{' '}
                    <Link to="/menus/new">메뉴 등록</Link>
                </nav>
            </header>

            <Routes>
                <Route path="/" element={<ListPage />} />
                <Route path="/menus/new" element={<MenuFormPage />} />
                <Route path="/menus/:menuCode" element={<DetailPage />} />
                <Route path="/menus/:menuCode/edit" element={<MenuFormPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    );
}

export default App;
