import { Link, Route, Routes } from 'react-router';
import DetailPage from './pages/DetailPage.jsx';
import ListPage from './pages/ListPage.jsx';
import MenuFormPage from './pages/MenuFormPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
    return (
        <div className="app-shell">
            <header className="site-header">
                <div className="header-inner">
                    <Link className="brand" to="/">
                        <img className="brand-avatar" src="/girl-avatar.png" alt="" />
                        <span>
                            <strong>채림이네 이상한 음식 스토어</strong>
                            <small>메뉴 관리</small>
                        </span>
                    </Link>
                    <nav className="main-nav" aria-label="주요 메뉴">
                        <Link to="/">메뉴 목록</Link>
                        <Link className="primary-link" to="/menus/new">메뉴 등록</Link>
                    </nav>
                </div>
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
