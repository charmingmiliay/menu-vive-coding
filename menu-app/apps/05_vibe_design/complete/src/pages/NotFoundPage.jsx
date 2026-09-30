import { Link } from 'react-router';

function NotFoundPage() {
    return (
        <main className="page-container compact-page empty-page">
            <p className="eyebrow">404</p>
            <h1>페이지를 찾을 수 없습니다</h1>
            <Link className="button primary-link" to="/">메뉴 목록으로</Link>
        </main>
    );
}

export default NotFoundPage;
