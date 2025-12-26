const API_BASE_URL = '/v1';

async function apiCall(endpoint, options = {}) {
    // method, headers, body, requiresAuth 변수를 선언하고 options 에서 꺼내서 없으면 초기값 설정
    const {
        method = 'GET',
        headers = {},
        body = null
    } = options;

    const fetchOptions = {
        method,
        credentials: 'same-origin'  // Include cookies (JWT token)
    };

    // FormData인 경우 Content-Type을 설정하지 않음 (브라우저가 자동으로 boundary 추가)
    if (body instanceof FormData) {
        fetchOptions.body = body;
        // headers는 추가하지 않음
        if (Object.keys(headers).length > 0) {
            fetchOptions.headers = headers;
        }
    } else {
        // JSON 데이터인 경우
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...headers
        };
        fetchOptions.headers = defaultHeaders;

        if(body && method !== 'GET') {
            fetchOptions.body = JSON.stringify(body);
        }
    }

    console.log('fetchOptions: ', fetchOptions);

    try {

        const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

        if(!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API 호출 실패');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

const api = {
    get : (endpoint, options = {}) => {
        return apiCall(endpoint, {...options, method: 'GET'});
    },
    post: (endpoint, body, options = {}) => {
        return apiCall(endpoint, {...options, method: 'POST', body});
    },
    put: (endpoint, body, options = {}) => {
        return apiCall(endpoint, {...options, method: 'PUT', body});
    },
    patch: (endpoint, body, options = {}) => {
        return apiCall(endpoint, {...options, method: 'PATCH', body});
    },
    delete: (endpoint, body, options = {}) => {
        return apiCall(endpoint, {...options, method: 'DELETE', body});
    }
};
