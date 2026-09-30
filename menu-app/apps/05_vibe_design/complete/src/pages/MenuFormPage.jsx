import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { createMenu, fetchCategoryList, fetchMenuDetail, updateMenu } from '../api/menu.js';
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

    if (loading) return <Status type="loading" message="입력 정보를 불러오고 있습니다." />;

    return (
        <main className="page-container form-page">
            <Link className="text-link" to={editing ? `/menus/${menuCode}` : '/'}>취소하고 돌아가기</Link>
            <section className="form-panel">
                <div className="form-heading">
                    <p className="eyebrow">MENU EDITOR</p>
                    <h1>{editing ? '메뉴 수정' : '새 메뉴 등록'}</h1>
                    <p>메뉴 정보와 판매 상태를 입력해 주세요.</p>
                </div>
                {error !== null && <Status type="error" message={error} />}
                <form onSubmit={handleSubmit}>
                    <label className="form-field">
                        <span>메뉴명</span>
                        <input name="menuName" type="text" value={form.menuName} onChange={handleChange} required />
                    </label>
                    <label className="form-field">
                        <span>가격</span>
                        <input name="menuPrice" type="number" min="0" value={form.menuPrice} onChange={handleChange} required />
                    </label>
                    <label className="form-field">
                        <span>카테고리</span>
                        <select name="categoryCode" value={form.categoryCode} onChange={handleChange} required>
                            <option value="">카테고리를 선택하세요</option>
                            {categories.map(category => (
                                <option key={category.categoryCode} value={category.categoryCode}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </label>
                    <fieldset className="status-control">
                        <legend>판매 상태</legend>
                        <label>
                            <input name="orderableStatus" type="radio" value="Y" checked={form.orderableStatus === 'Y'} onChange={handleChange} />
                            주문 가능
                        </label>
                        <label>
                            <input name="orderableStatus" type="radio" value="N" checked={form.orderableStatus === 'N'} onChange={handleChange} />
                            주문 불가
                        </label>
                    </fieldset>
                    <button className="submit-button" type="submit" disabled={saving}>
                        {saving ? '저장 중...' : editing ? '변경사항 저장' : '메뉴 등록'}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default MenuFormPage;
