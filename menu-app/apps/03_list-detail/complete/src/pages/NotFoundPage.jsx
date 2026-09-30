/* NotFoundPage.jsx - 어느 Route 에도 맞지 않는 주소일 때

   주소를 직접 쳐서 들어오는 경우가 있으므로 반드시 만들어 둔다.
   이것이 없으면 잘못된 주소에서 화면이 텅 비어 "고장났나" 싶게 된다. */

import { Link } from 'react-router';

function NotFoundPage() {
    return (
        <div className="notfound">
            <p className="status status-empty">없는 주소입니다.</p>
            <Link to="/">목록으로</Link>
        </div>
    );
}

export default NotFoundPage;
