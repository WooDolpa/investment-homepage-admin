const san = {
    // alert 함수
    warningAlert : function(message) {
        Swal.fire({
            icon: 'warning',
            text: message,
            confirmButtonText: '확인',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn-alert'
            }
        });
    },
    errorAlert : function(message) {
        Swal.fire({
            icon: 'error',
            text: message,
            confirmButtonText: '확인',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn-alert'
            }
        });
    }
};