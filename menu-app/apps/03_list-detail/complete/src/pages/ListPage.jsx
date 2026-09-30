/* ListPage.jsx - menudb의 메뉴 목록을 조회하고 검색한다. */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { fetchMenuList } from '../api/menu.js';
import Status from '../components/Status.jsx';

function ListPage() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [keyword, setKeyword] = useState('');

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

    if (error !== null) return <Status type="error" message={error} />;
    if (loading) return <Status type="loading" message="메뉴를 불러오는 중..." />;

    return (
        <main>
            <h2>메뉴 목록</h2>
            <input
                className="search"
                type="search"
                value={keyword}
                onChange={event => setKeyword(event.target.value)}
                placeholder="메뉴명 또는 카테고리 검색"
            />

            {filteredMenus.length === 0 ? (
                <Status type="empty" message="검색 결과가 없습니다." />
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>코드</th>
                            <th>메뉴명</th>
                            <th>가격</th>
                            <th>카테고리</th>
                            <th>주문 가능</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMenus.map(menu => (
                            <tr key={menu.menuCode}>
                                <td>{menu.menuCode}</td>
                                <td>
                                    <Link to={`/menus/${menu.menuCode}`}>
                                        {menu.menuName}
                                    </Link>
                                </td>
                                <td>{menu.menuPrice.toLocaleString()}원</td>
                                <td>{menu.categoryName}</td>
                                <td>{menu.orderableStatus === 'Y' ? '가능' : '불가'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
}

export default ListPage;
