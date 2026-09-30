/* pokemon.js - PokeAPI 요청

   목록과 상세의 주소가 따로 있다. 이 구조가 5~6일차 Spring Boot 의
   GET /api/pokemon, GET /api/pokemon/{id} 와 같다. */

import axios from 'axios';

const BASE = 'https://pokeapi.co/api/v2';

/* 목록 - 이름과 상세 주소만 준다. 이미지나 타입은 들어 있지 않다. */
export async function fetchPokemonList(limit = 200) {

    const response = await axios.get(`${BASE}/pokemon`, { params: { limit } });

    /* 응답의 url 은 'https://pokeapi.co/api/v2/pokemon/25/' 형태다.
       여기서 id 만 뽑아 둔다. 목록 화면에서 이미지 주소를 만들 때 쓴다. */
    return response.data.results.map(item => {
        const id = Number(item.url.split('/').filter(Boolean).pop());
        return { id, name: item.name };
    });
}

/* 상세 - 한 마리의 전체 정보 */
export async function fetchPokemonDetail(id) {
    const response = await axios.get(`${BASE}/pokemon/${id}`);
    const data = response.data;

    // 조회할 포켓몬 id와 데이터를 콘솔에 출력한다.
    console.log(id, data);

    return {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        types: data.types.map(t => t.type.name),
        image: data.sprites.other['official-artwork'].front_default ?? data.sprites.front_default
    };
}

/* 이미지 주소는 id 로 조립할 수 있다. 목록에서 151번 요청을 더 보내지 않아도 된다. */
export function imageUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
