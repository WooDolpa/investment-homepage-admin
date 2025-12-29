const san = {
    // alert 함수
    warningAlert : function(message) {
        Swal.fire({
            icon: 'warning',
            html: message,
            confirmButtonText: '확인',
            buttonsStyling: false,
            customClass: {
                popup: 'swal-popup-custom',
                htmlContainer: 'swal-text-default',
                confirmButton: 'btn-alert'
            }
        });
    },
    errorAlert : function(message) {
        Swal.fire({
            icon: 'error',
            html: message,
            confirmButtonText: '확인',
            buttonsStyling: false,
            customClass: {
                popup: 'swal-popup-custom',
                htmlContainer: 'swal-text-default',
                confirmButton: 'btn-alert'
            }
        });
    },
    successAlert : function(message, callback) {
        Swal.fire({
            icon: 'success',
            html: message,
            confirmButtonText: '확인',
            buttonsStyling: false,
            customClass: {
                popup: 'swal-popup-custom',
                htmlContainer: 'swal-text-default',
                confirmButton: 'btn-alert'
            }
        }).then((result) => {
           if(result.isConfirmed && callback) {
               callback();
           }
        });
    },
    infoAlert : function(message) {
        Swal.fire({
            icon: 'info',
            html: message,
            confirmButtonText: '확인',
            buttonsStyling: false,
            customClass: {
                popup: 'swal-popup-custom',
                htmlContainer: 'swal-text-default',
                confirmButton: 'btn-alert'
            }
        });
    },
    confirm : function(message, confirmCallback, cancelCallback) {

        const confirm = Swal.mixin({
            customClass: {
                popup: 'swal-popup-custom',
                htmlContainer: 'swal-text-default',
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        confirm.fire({
            html: message,
            icon: 'info',
            showCancelButton: true,
            cancelButtonText: '취소',
            confirmButtonText: '확인',
            reverseButtons: false
        }).then((result) => {
           if(result.isConfirmed) {
               if(confirmCallback) confirmCallback();
           } else if(result.dismiss === Swal.DismissReason.cancel) {
               if(cancelCallback) cancelCallback();
           }
        });
    },
    toast : function(message, icon = 'success', timer = 3000, position = 'top-end') {
        const Toast = Swal.mixin({
            toast: true,
            position: position,
            showConfirmButton: false,
            timer: timer,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: icon,
            title: message
        });
    }
};
