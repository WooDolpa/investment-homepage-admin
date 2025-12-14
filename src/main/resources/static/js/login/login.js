document.addEventListener("DOMContentLoaded", function() {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // 기본 폼 제출 방지

        const loginId = document.getElementById('loginId').value.trim();
        const password = document.getElementById('password').value;

        if(!loginId) {
            // 아이디 입력
            san.warningAlert('아이디를 입력해주세요.');
            return;
        }

        if(!password) {
            // 비밀번호 입력
            san.warningAlert('비밀번호를 입력해주세요.');
            return;
        }

        try {
            await login(loginId, password);
            // 성공 시 메인페이지 이동

        }catch (error) {

        }
    });

});
