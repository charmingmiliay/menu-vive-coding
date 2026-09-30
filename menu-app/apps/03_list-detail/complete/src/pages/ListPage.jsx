/* ListPage.jsx - 목록 화면

   앱 2 와 구조가 같다. 로딩 / 에러 / 빈 결과 / 정상 네 갈래.
   달라진 것은 각 항목이 Link 로 상세 화면과 이어진다는 것뿐이다. */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { fetchPokemonList, imageUrl } from '../api/pokemon.js';
import Status from '../components/Status.jsx';

function ListPage() {

    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);
                setError(null);
                const list = await fetchPokemonList();
                if (alive) setPokemons(list);
            } catch (e) {
                if (alive) setError(e.message);
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => { alive = false; };
    }, []);

    /* ── TODO 2. 검색어로 거른다 ──
       useMemo 는 앱 2 에서와 같은 이유로 쓴다. keyword 가 의존성이라 실제로 절약되는 것은 거의 없고,
       파생 값에 이름을 붙이는 자리로 본다. 게다가 여기는 151마리뿐이다. */
    const filtered = useMemo(() => {
        const k = keyword.trim().toLowerCase();
        if (k === '') return pokemons;
        return pokemons.filter(p => p.name.includes(k));
    }, [pokemons, keyword]);

    if (error !== null) return <Status type="error" message={error} />;
    if (loading) return <Status type="loading" message="불러오는 중..." />;

    return (
        <>
            <input
                className="search"
                type="text"
                value={keyword}
                onChange={event => setKeyword(event.target.value)}
                placeholder="이름으로 검색 (예: pika)"
            />

            {filtered.length === 0 ? (
                <Status type="empty" message="검색 결과가 없습니다." />
            ) : (
                <ul className="grid">
                    {filtered.map(pokemon => (
                        <li key={pokemon.id} className="cell">
                            {/* ── TODO 3. 상세로 가는 Link ──
                                주소에 id 를 끼워 넣는다. 이 주소가 곧 상세 화면이다. */}
                            <Link to={`/pokemon/${pokemon.id}`}>
                                <img src={imageUrl(pokemon.id)} alt={pokemon.name} width="96" height="96" loading="lazy" />
                                <span className="name">#{pokemon.id} {pokemon.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default ListPage;
