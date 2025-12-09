const san = {
    // alert 함수
    warningAlert : function(title, message) {
        Swal.fire({
            icon: 'warning',
            title: title,
            text: message,
            confirmButtonText: '확인',
            customClass: {}
        });
    }
};