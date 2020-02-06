export default function authHeader() {
    const psychic = localStorage.getItem('psychicToken');

    if (psychic) {
        return {
            Authorization: 'Bearer ' + psychic,
            // 'Content-Type': 'application/json;charset=UTF-8',
            // 'Access-Control-Allow-Origin': '*'
        };
    } else {
        return {};
    }
}
