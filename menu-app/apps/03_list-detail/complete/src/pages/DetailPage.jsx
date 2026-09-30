/* DetailPage.jsx - 메뉴 상세 조회와 삭제를 처리한다. */

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
            setError(null);
            await deleteMenu(menuCode);
            navigate('/');
        } catch (e) {
            setError(e.response?.data?.message ?? e.message);
            setDeleting(false);
        }
    }

    if (error !== null && menu === null) {
        return (
            <>
                <Status type="error" message={error} />
                <Link to="/">목록으로</Link>
            </>
        );
    }
    if (loading) return <Status type="loading" message="메뉴를 불러오는 중..." />;

    return (
        <article className="detail">
            <h2>{menu.menuName}</h2>
            {error !== null && <Status type="error" message={error} />}

            <dl>
                <dt>메뉴 코드</dt>
                <dd>{menu.menuCode}</dd>
                <dt>가격</dt>
                <dd>{menu.menuPrice.toLocaleString()}원</dd>
                <dt>카테고리</dt>
                <dd>{menu.categoryName} ({menu.categoryCode})</dd>
                <dt>주문 가능</dt>
                <dd>{menu.orderableStatus === 'Y' ? '가능' : '불가'}</dd>
            </dl>

            <button type="button" onClick={() => navigate(-1)}>뒤로가기</button>
            <button type="button" onClick={() => navigate(`/menus/${menuCode}/edit`)}>수정</button>
            <button type="button" onClick={handleDelete} disabled={deleting}>
                {deleting ? '삭제 중...' : '삭제'}
            </button>
        </article>
    );
}

export default DetailPage;
