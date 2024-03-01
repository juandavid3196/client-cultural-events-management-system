const SERVER_URL = 'http://localhost:8007/api/responsability-by-mode?skip=0&limit=125';

const API_ROUTES = {
    responsabilitysModeId: `${SERVER_URL}`,
};

const fetcher = (url) => fetch(url).then((res) => res.json());

export { SERVER_URL, API_ROUTES, fetcher };
