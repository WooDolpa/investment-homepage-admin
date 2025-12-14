// 로그인 함수
async function login(id, password) {
    try {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: { id, password }
        });

        window.location.assign('/company');

    }catch (error) {
        san.errorAlert(error.message);
    }
}

// 로그아웃
async function logout() {

    try {

        const response = await apiCall('/auth/logout', {
            method: 'GET'
        });

        window.location.assign('/login');

    }catch (error) {
        san.errorAlert(error.message);
    }
}
