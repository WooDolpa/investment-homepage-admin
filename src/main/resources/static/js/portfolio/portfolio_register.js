document.addEventListener('DOMContentLoaded', function() {
    // Element selections
    const listButton = document.getElementById('listButton');
    const saveButton = document.getElementById('saveButton');
    const imageInput = document.getElementById('portfolioImage');
    const imagePreview = document.getElementById('imagePreview');

    // Initialize Quill Editor
    let quillEditor = null;
    if (document.getElementById('portfolioDetailEditor')) {
        quillEditor = new Quill('#portfolioDetailEditor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }, { 'size': [] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
                    [{ 'align': [] }],
                    ['blockquote', 'code-block'],
                    ['link', 'image', 'video'],
                    ['clean']
                ]
            },
            placeholder: '상세 내용을 입력하세요...'
        });

        // Update hidden input on change
        quillEditor.on('text-change', function() {
            document.getElementById('portfolioDetail').value = quillEditor.root.innerHTML;
        });
    }

    // List button click
    listButton.addEventListener('click', function() {
        san.confirm('목록으로 돌아가시겠습니까?<br>저장하지 않은 내용은 사라집니다.', function (){
            window.location.href = '/portfolio';
        });
    });

    // Save button click - submit form
    saveButton.addEventListener('click', function() {
        handleSubmit();
    });

    // File input handler
    imageInput.addEventListener('change', function(e) {
        handleFilePreview(e.target, imagePreview);
    });

    // Handle file preview
    function handleFilePreview(input, previewContainer) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                previewContainer.classList.add('active');
                previewContainer.parentElement.querySelector('.file-upload-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle form submission
    function handleSubmit() {
        // Collect form values
        const portfolioTitle = document.getElementById('portfolioTitle').value;
        const portfolioSummary = document.getElementById('portfolioSummary').value;
        const portfolioOrder = document.getElementById('portfolioOrder').value;
        const portfolioDetail = document.getElementById('portfolioDetail').value;
        const portfolioType = document.querySelector('input[name="portfolioType"]:checked').value;
        const portfolioImageFile = imageInput.files[0];

        // Validation
        if (!portfolioTitle) {
            san.warningAlert('제목을 입력해주세요.');
            document.getElementById('portfolioTitle').focus();
            return;
        }

        if (!portfolioSummary) {
            san.warningAlert('요약 정보를 입력해주세요.');
            document.getElementById('portfolioSummary').focus();
            return;
        }

        if (!portfolioOrder) {
            san.warningAlert('순번을 입력해주세요.');
            document.getElementById('portfolioOrder').focus();
            return;
        }

        if (!portfolioDetail) {
            san.warningAlert('상세 내용을 입력해주세요.');
            quillEditor.focus();
            return;
        }

        if (!portfolioImageFile) {
            san.warningAlert('포트폴리오 이미지를 업로드해주세요.');
            return;
        }

        // Create FormData for multipart/form-data request
        const formData = new FormData();

        // Add image file
        formData.append('imageFile', portfolioImageFile);

        // Create JSON body for PortfolioDto
        const jsonBody = {
            title: portfolioTitle,
            summary: portfolioSummary,
            orderNum: parseInt(portfolioOrder),
            contents: portfolioDetail,
            portfolioType: portfolioType
        };

        // Add JSON body as Blob
        formData.append('jsonBody', new Blob([JSON.stringify(jsonBody)], { type: 'application/json' }));

        // Call POST API using api.post()
        api.post('/portfolio', formData)
            .then(data => {
                san.toast('포트폴리오가 등록되었습니다.', 'success');
                setTimeout(() =>{
                    window.location.href = '/portfolio';
                }, 700);

            })
            .catch(error => {
                console.error('Error registering portfolio:', error);
                san.errorAlert('등록 중 오류가 발생했습니다.');
            });
    }
});
