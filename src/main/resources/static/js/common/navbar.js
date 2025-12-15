document.addEventListener("DOMContentLoaded", function() {

    const logoutIcons = document.getElementById('logoutIcons');

    logoutIcons.addEventListener('click', function (e){
       e.preventDefault();
       san.confirm('로그아웃을 하시겠습니까?', async function(){
           await logout();
       });
    });
});