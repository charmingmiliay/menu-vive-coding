import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { deleteMenu, fetchMenuDetail } from '../api/menu.js';
import Status from '../components/Status.jsx';

function DetailPage() {
    const { menuCode } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchMenuDetail(menuCode);
                if (alive) setMenu(data);
            } catch (e) {
                if (alive) setError(e.response?.data?.message ?? '메뉴를 찾을 수 없습니다.');
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => { alive = false; };
    }, [menuCode]);

    async function handleDelete() {
        if (!window.confirm(`${menu.menuName} 메뉴를 삭제하시겠습니까?`)) return;

        try {
            setDeleting(true);
            await deleteMenu(menuCode);
            navigate('/');
        } catch (e) {
            setError(e.response?.data?.message ?? e.message);
            setDeleting(false);
        }
    }

    if (loading) return <Status type="loading" message="메뉴 정보를 불러오고 있습니다." />;
    if (menu === null) {
        return (
            <main className="page-container compact-page">
                <Status type="error" message={error} />
                <Link className="text-link" to="/">목록으로 돌아가기</Link>
            </main>
        );
    }

    return (
        <main className="page-container compact-page">
            <Link className="text-link" to="/">목록으로 돌아가기</Link>
            <article className="detail-panel">
                <div className="detail-content">
                    <p className="eyebrow">{menu.categoryName}</p>
                    <h1>{menu.menuName}</h1>
                    <strong className="detail-price">{menu.menuPrice.toLocaleString()}원</strong>
                    <dl>
                        <div><dt>메뉴 코드</dt><dd>#{menu.menuCode}</dd></div>
                        <div><dt>카테고리</dt><dd>{menu.categoryName}</dd></div>
                        <div><dt>판매 상태</dt><dd>{menu.orderableStatus === 'Y' ? '주문 가능' : '주문 불가'}</dd></div>
                    </dl>
                    {error !== null && <Status type="error" message={error} />}
                    <div className="button-row">
                        <Link className="button secondary-button" to={`/menus/${menuCode}/edit`}>수정</Link>
                        <button className="danger-button" type="button" onClick={handleDelete} disabled={deleting}>
                            {deleting ? '삭제 중...' : '삭제'}
                        </button>
                    </div>
                </div>
            </article>
        </main>
    );
}

export default DetailPage;
