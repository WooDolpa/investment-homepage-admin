// 로그아웃 함수
function isAuthenticated() {
    return !!localStorage.getItem('accessToken');
}
// 401 에러 처리 (토큰 갱신)
async function handleUnauthorized() {
    const refreshToken = localStorage.getItem('refreshToken');
    if(!refreshToken) {
        logout();
        return;
    }

    try {
        // Refresh Token 으로 새 Access Token 발급
        const response = await apiCall('/auth/refresh', {
           method: 'POST',
           body: { refreshToken },
           requiresAuth: false
        });

        localStorage.setItem('accessToken', response.accessToken);
    }catch (error) {
        // Refresh Token 도 만료된 경우
        logout();
    }
}

// 로그인 함수
async function login(id, password) {
    try {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: { id, password },
            requiresAuth: false
        });

        // 토큰 저장
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        return response;

    }catch (error) {
        san.errorAlert(error.message);
    }
}

// 로그아웃
function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
}