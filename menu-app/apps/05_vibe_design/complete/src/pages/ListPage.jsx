import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { fetchMenuList } from '../api/menu.js';
import Status from '../components/Status.jsx';

const PAGE_SIZE = 20;

function ListPage() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchMenuList();
                if (alive) setMenus(data);
            } catch (e) {
                if (alive) setError(e.response?.data?.message ?? e.message);
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => { alive = false; };
    }, []);

    const filteredMenus = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();
        if (normalizedKeyword === '') return menus;

        return menus.filter(menu =>
            menu.menuName.toLowerCase().includes(normalizedKeyword)
            || menu.categoryName?.toLowerCase().includes(normalizedKeyword)
        );
    }, [menus, keyword]);

    const totalPages = Math.max(1, Math.ceil(filteredMenus.length / PAGE_SIZE));
    const visibleMenus = filteredMenus.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function handleSearch(event) {
        setKeyword(event.target.value);
        setPage(1);
    }

    if (loading) return <Status type="loading" message="메뉴를 준비하고 있습니다." />;
    if (error !== null) return <Status type="error" message={error} />;

    return (
        <main className="page-container">
            <section className="page-heading">
                <div>
                    <p className="eyebrow">MENU COLLECTION</p>
                    <h1>맛있는 한 끼를 골라보세요</h1>
                    <p>현재 {menus.length}개의 메뉴를 관리하고 있습니다.</p>
                </div>
                <label className="search-field">
                    <span>메뉴 검색</span>
                    <input
                        type="search"
                        value={keyword}
                        onChange={handleSearch}
                        placeholder="메뉴명 또는 카테고리"
                    />
                </label>
            </section>

            {visibleMenus.length === 0 ? (
                <Status type="empty" message="조건에 맞는 메뉴가 없습니다." />
            ) : (
                <section className="menu-grid" aria-label="메뉴 목록">
                    {visibleMenus.map(menu => (
                        <article className="menu-card" key={menu.menuCode}>
                            <div className="card-content">
                                <div className="card-topline">
                                    <span className="category">{menu.categoryName}</span>
                                <span className={`availability availability-${menu.orderableStatus.toLowerCase()}`}>
                                    {menu.orderableStatus === 'Y' ? '주문 가능' : '준비 중'}
                                </span>
                                </div>
                                <h2>
                                    <Link to={`/menus/${menu.menuCode}`}>{menu.menuName}</Link>
                                </h2>
                                <div className="card-bottom">
                                    <strong>{menu.menuPrice.toLocaleString()}원</strong>
                                    <span>#{menu.menuCode}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}

            {totalPages > 1 && (
                <nav className="pagination" aria-label="메뉴 페이지">
                    <button
                        type="button"
                        onClick={() => setPage(current => current - 1)}
                        disabled={page === 1}
                        aria-label="이전 페이지"
                    >
                        이전
                    </button>
                    <span>{page} / {totalPages}</span>
                    <button
                        type="button"
                        onClick={() => setPage(current => current + 1)}
                        disabled={page === totalPages}
                        aria-label="다음 페이지"
                    >
                        다음
                    </button>
                </nav>
            )}
        </main>
    );
}

export default ListPage;
