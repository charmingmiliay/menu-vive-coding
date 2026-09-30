/* MenuFormPage.jsx - 메뉴 등록과 수정에 함께 사용하는 폼이다. */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
    createMenu,
    fetchCategoryList,
    fetchMenuDetail,
    updateMenu
} from '../api/menu.js';
import Status from '../components/Status.jsx';

const initialForm = {
    menuName: '',
    menuPrice: '',
    categoryCode: '',
    orderableStatus: 'Y'
};

function MenuFormPage() {
    const { menuCode } = useParams();
    const navigate = useNavigate();
    const editing = menuCode !== undefined;
    const [form, setForm] = useState(initialForm);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);
                setError(null);
                const categoryList = await fetchCategoryList();
                if (!alive) return;

                setCategories(categoryList);
                if (editing) {
                    const menu = await fetchMenuDetail(menuCode);
                    if (!alive) return;
                    setForm({
                        menuName: menu.menuName,
                        menuPrice: String(menu.menuPrice),
                        categoryCode: String(menu.categoryCode),
                        orderableStatus: menu.orderableStatus
                    });
                }
            } catch (e) {
                if (alive) setError(e.response?.data?.message ?? e.message);
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => { alive = false; };
    }, [editing, menuCode]);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm(current => ({ ...current, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setSaving(true);
            setError(null);
            const savedMenu = editing
                ? await updateMenu(menuCode, form)
                : await createMenu(form);
            navigate(`/menus/${savedMenu.menuCode}`);
        } catch (e) {
            setError(e.response?.data?.message ?? e.message);
            setSaving(false);
        }
    }

    if (loading) return <Status type="loading" message="입력 정보를 불러오는 중..." />;

    return (
        <main>
            <h2>{editing ? '메뉴 수정' : '메뉴 등록'}</h2>
            {error !== null && <Status type="error" message={error} />}

            <form onSubmit={handleSubmit}>
                <p>
                    <label>
                        메뉴명<br />
                        <input
                            name="menuName"
                            type="text"
                            value={form.menuName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </p>
                <p>
                    <label>
                        가격<br />
                        <input
                            name="menuPrice"
                            type="number"
                            min="0"
                            value={form.menuPrice}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </p>
                <p>
                    <label>
                        카테고리<br />
                        <select
                            name="categoryCode"
                            value={form.categoryCode}
                            onChange={handleChange}
                            required
                        >
                            <option value="">카테고리를 선택하세요</option>
                            {categories.map(category => (
                                <option key={category.categoryCode} value={category.categoryCode}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </label>
                </p>
                <fieldset>
                    <legend>주문 가능 여부</legend>
                    <label>
                        <input
                            name="orderableStatus"
                            type="radio"
                            value="Y"
                            checked={form.orderableStatus === 'Y'}
                            onChange={handleChange}
                        />
                        가능
                    </label>{' '}
                    <label>
                        <input
                            name="orderableStatus"
                            type="radio"
                            value="N"
                            checked={form.orderableStatus === 'N'}
                            onChange={handleChange}
                        />
                        불가
                    </label>
                </fieldset>

                <p>
                    <button type="submit" disabled={saving}>
                        {saving ? '저장 중...' : '저장'}
                    </button>{' '}
                    <Link to={editing ? `/menus/${menuCode}` : '/'}>취소</Link>
                </p>
            </form>
        </main>
    );
}

export default MenuFormPage;
