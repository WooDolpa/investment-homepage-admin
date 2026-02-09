// Business Card Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const cardImage1 = document.getElementById('cardImage1');
    const cardImage2 = document.getElementById('cardImage2');
    const cardImage1Preview = document.getElementById('cardImage1Preview');
    const cardImage2Preview = document.getElementById('cardImage2Preview');
    const updateImageButton = document.getElementById('updateImageButton');

    // File input handlers
    cardImage1.addEventListener('change', function() {
        handleFilePreview(this, cardImage1Preview);
    });

    cardImage2.addEventListener('change', function() {
        handleFilePreview(this, cardImage2Preview);
    });

    function handleFilePreview(input, previewContainer) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewContainer.innerHTML = '<img src="' + e.target.result + '" alt="Preview">';
                previewContainer.classList.add('active');
                previewContainer.parentElement.querySelector('.file-upload-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    }

    // Update image button click
    updateImageButton.addEventListener('click', function() {
        const cardImageFile1 = cardImage1.files[0];
        const cardImageFile2 = cardImage2.files[0];

        if (!cardImageFile1 && !cardImageFile2) {
            san.warningAlert('업로드할 이미지를 선택해주세요.');
            return;
        }

        san.confirm('명함 이미지를 수정하시겠습니까?', function() {
            const formData = new FormData();

            if (cardImageFile1) {
                formData.append('businessCard1File', cardImageFile1);
            }
            if (cardImageFile2) {
                formData.append('businessCard2File', cardImageFile2);
            }

            const companyNo = document.getElementById('companyNo').value;
            const jsonBody = { companyNo: companyNo };
            formData.append('jsonBody', new Blob([JSON.stringify(jsonBody)], { type: 'application/json' }));

            api.put('/company/business/card', formData)
                .then(function() {
                    san.toast('명함 이미지가 수정되었습니다.', 'success', 1000);
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                })
                .catch(function(error) {
                    san.errorAlert(error.message || '이미지 수정 중 오류가 발생했습니다.');
                });
        });
    });

    console.log('Business card page initialized');
});
