/* DetailPage.jsx - 상세 화면

   주소의 :id 를 읽어서 그 값으로 서버에 요청한다.
   주소가 곧 상태다. 새로고침해도, 링크를 복사해서 보내도 같은 화면이 뜬다. */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { fetchPokemonDetail } from '../api/pokemon.js';
import Status from '../components/Status.jsx';

function DetailPage() {

    /* ── TODO 4-(1). 주소에서 id 를 꺼낸다 ──
       useParams 는 주소에서 :id 자리의 값을 꺼내 준다. 언제나 문자열이다. */
    const { id } = useParams();

    /* ── TODO 5. 코드로 주소를 바꾼다 ──
       useNavigate 는 코드로 주소를 바꿀 때 쓴다. 버튼 클릭 같은 경우다. */
    const navigate = useNavigate();

    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* ── TODO 4-(2)(3). id 로 상세를 불러온다 ── */
    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                // loading 을 켜고 error 를 비운다
                setLoading(true);
                setError(null);
                // fetchPokemonDetail(id) 를 기다렸다가 받은 값을 pokemon 에 넣는다
                const data = await fetchPokemonDetail(id);
                if (alive) setPokemon(data);
            } catch {
                // 읽을 수 있는 문장을 error 에 넣는다
                if (alive) setError('해당 번호의 포켓몬을 찾을 수 없습니다.');
            } finally {
                // loading 을 끈다
                if (alive) setLoading(false);
            }
        }

        load();
        return () => { alive = false; };

        /* 의존성 배열에 id 가 들어간다.
           목록에서 다른 포켓몬을 누르면 같은 컴포넌트가 그대로 있고 id 만 바뀐다.
           빈 배열로 두면 주소는 바뀌는데 화면은 그대로인 버그가 난다. */
    }, [id]); // c: id값이 바뀔때마다 detailPage를 다시 그려라.

    if (error !== null) {
        return (
            <>
                <Status type="error" message={error} />
                <Link to="/">목록으로</Link>
            </>
        );
    }

    if (loading) return <Status type="loading" message="불러오는 중..." />;

    /* pokemon 의 초기값이 null 이므로 여기까지 오기 전에 반드시 걸러야 한다.
       위 두 분기가 없으면 pokemon.name 에서 화면이 죽는다. */
    return (
        <article className="detail">
            {/* ── TODO 4-(4). 상세 정보를 그린다 ──
                types 는 배열이라 join 으로 잇고, height·weight 는 10 으로 나눈다. */}
            <img src={pokemon.image} alt={pokemon.name} width="200" height="200" />

            <h2>#{pokemon.id} {pokemon.name}</h2>

            <dl>
                <dt>타입</dt>
                <dd>{pokemon.types.join(', ')}</dd>
                <dt>키</dt>
                <dd>{pokemon.height / 10} m</dd>
                <dt>몸무게</dt>
                <dd>{pokemon.weight / 10} kg</dd>
            </dl>

            {/* TODO 5. 코드로 주소를 바꾸는 두 가지 방법 */}
            <button type="button" onClick={() => navigate(-1)}>뒤로가기</button>
            <button type="button" onClick={() => navigate('/')}>목록으로</button>
        </article>
    );
}

export default DetailPage;
