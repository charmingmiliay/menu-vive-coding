import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_MENU_API_BASE ?? '/api'
});

function getResult(response) {
    return response.data.result;
}

function toMenuPayload(menu) {
    return {
        menuName: menu.menuName.trim(),
        menuPrice: Number(menu.menuPrice),
        categoryCode: Number(menu.categoryCode),
        orderableStatus: menu.orderableStatus
    };
}

export async function fetchMenuList() {
    const response = await api.get('/menus');
    return getResult(response).menus;
}

export async function fetchMenuDetail(menuCode) {
    const response = await api.get(`/menus/${menuCode}`);
    return getResult(response).menu;
}

export async function fetchCategoryList() {
    const response = await api.get('/categories');
    return getResult(response).categories;
}

export async function createMenu(menu) {
    const response = await api.post('/menus', toMenuPayload(menu));
    return getResult(response).menu;
}

export async function updateMenu(menuCode, menu) {
    const response = await api.put(`/menus/${menuCode}`, toMenuPayload(menu));
    return getResult(response).menu;
}

export async function deleteMenu(menuCode) {
    await api.delete(`/menus/${menuCode}`);
}
