document.addEventListener('DOMContentLoaded', function() {
    // Element selections
    const listButton = document.getElementById('listButton');
    const updateButton = document.getElementById('updateButton');
    const imageInput = document.getElementById('portfolioImage');
    const imagePreview = document.getElementById('imagePreview');

    // Status Select
    const statusSelect = document.getElementById('statusSelect');
    const statusTrigger = statusSelect.querySelector('.custom-select-trigger');
    const selectedStatus = document.getElementById('selectedStatus');
    const portfolioStatus = document.getElementById('portfolioStatus');
    const statusOptions = statusSelect.querySelectorAll('.custom-option');

    let portfolioNo = null;

    // Get portfolioNo from URL
    const urlParams = new URLSearchParams(window.location.search);
    portfolioNo = urlParams.get('portfolioNo');

    if (!portfolioNo) {
        san.errorAlert('잘못된 접근입니다.');
        window.location.href = '/portfolio';
        return;
    }

    // Status select event handlers
    statusTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        statusSelect.classList.toggle('open');
    });

    statusOptions.forEach(function(option) {
        option.addEventListener('click', function(e) {
            e.stopPropagation();

            // Remove selected class from all
            statusOptions.forEach(function(opt) {
                opt.classList.remove('selected');
            });

            // Add selected class to clicked option
            this.classList.add('selected');

            // Update display value
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            selectedStatus.textContent = text;
            portfolioStatus.value = value;

            // Close dropdown
            statusSelect.classList.remove('open');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!statusSelect.contains(e.target)) {
            statusSelect.classList.remove('open');
        }
    });

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

    // Update button click - submit form
    updateButton.addEventListener('click', function() {
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

    // Load image preview from URL
    function loadImagePreview(imageUrl, previewContainer) {
        if (imageUrl) {
            previewContainer.innerHTML = `<img src="${imageUrl}" alt="Existing Image">`;
            previewContainer.classList.add('active');
            previewContainer.parentElement.querySelector('.file-upload-placeholder').style.display = 'none';
        }
    }

    // Handle form submission
    function handleSubmit() {
        // Collect form values
        const portfolioTitle = document.getElementById('portfolioTitle').value;
        const portfolioSummary = document.getElementById('portfolioSummary').value;
        const portfolioOrder = document.getElementById('portfolioOrder').value;
        const portfolioDetail = document.getElementById('portfolioDetail').value;
        const portfolioStatusValue = portfolioStatus.value;
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

        // Create FormData for multipart/form-data request
        const formData = new FormData();

        // Add image file (optional - only if new file is selected)
        if (portfolioImageFile) {
            formData.append('imageFile', portfolioImageFile);
        }

        // Create JSON body for PortfolioDto
        const jsonBody = {
            portfolioNo: parseInt(portfolioNo),
            title: portfolioTitle,
            summary: portfolioSummary,
            orderNum: parseInt(portfolioOrder),
            contents: portfolioDetail,
            dataStatus: portfolioStatusValue
        };

        // Add JSON body as Blob
        formData.append('jsonBody', new Blob([JSON.stringify(jsonBody)], { type: 'application/json' }));

        console.log('Submitting portfolio update:', jsonBody);

        // Call PUT API using api.put()
        api.put('/portfolio', formData)
            .then(data => {

                san.toast('포트폴리오가 수정되었습니다.', 'success');
                setTimeout(() =>{
                    window.location.href = '/portfolio';
                }, 700);

            })
            .catch(error => {
                console.error('Error updating portfolio:', error);
                san.errorAlert('수정 중 오류가 발생했습니다.');
            });
    }

    // Load portfolio data
    function loadPortfolioData() {
        api.get(`/portfolio/${portfolioNo}`)
            .then(response => {
                const data = response.data;
                if (data) {
                    // Set basic info
                    document.getElementById('portfolioTitle').value = data.title || '';
                    document.getElementById('portfolioSummary').value = data.summary || '';
                    document.getElementById('portfolioOrder').value = data.orderNum || '';

                    // Set status
                    if (data.status) {
                        portfolioStatus.value = data.status;
                        // Update selected option in dropdown
                        statusOptions.forEach(function(opt) {
                            opt.classList.remove('selected');
                            if (opt.getAttribute('data-value') === data.status) {
                                opt.classList.add('selected');
                                selectedStatus.textContent = opt.textContent;
                            }
                        });
                    }

                    // Set Quill editor content
                    if (quillEditor && data.contents) {
                        quillEditor.root.innerHTML = data.contents;
                        document.getElementById('portfolioDetail').value = data.contents;
                    }

                    // Load image preview
                    if (data.imageUrl) {
                        loadImagePreview(data.imageUrl, imagePreview);
                    }

                    console.log('Portfolio data loaded:', data);
                }
            })
            .catch(error => {
                console.error('Error loading portfolio data:', error);
                san.errorAlert('포트폴리오 정보를 불러오는 중 오류가 발생했습니다.');
            });
    }

    // Initialize
    loadPortfolioData();

    console.log('Portfolio update page initialized');
});
