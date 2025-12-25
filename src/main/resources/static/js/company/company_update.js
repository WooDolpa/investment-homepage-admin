document.addEventListener('DOMContentLoaded', function() {
    // Element selections
    const stepItems = document.querySelectorAll('.step-item');
    const formSteps = document.querySelectorAll('.form-step');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const listButton = document.getElementById('listButton');
    const applyButton = document.getElementById('applyButton');
    const logoInput = document.getElementById('logoImage');
    const mainInput = document.getElementById('mainImage');
    const logoPreview = document.getElementById('logoPreview');
    const mainPreview = document.getElementById('mainPreview');
    const searchAddressButton = document.getElementById('searchAddressButton');

    let currentStep = 1;
    const totalSteps = 2;

    // Initialize Quill Editor
    let quillEditor = null;
    if (document.getElementById('companyInfoEditor')) {
        quillEditor = new Quill('#companyInfoEditor', {
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
            placeholder: '회사 정보를 입력하세요...'
        });

        // Load initial content
        const companyInfoInput = document.getElementById('companyInfo');
        if (companyInfoInput && companyInfoInput.value) {
            quillEditor.root.innerHTML = companyInfoInput.value;
        }

        // Update hidden input on change
        quillEditor.on('text-change', function() {
            companyInfoInput.value = quillEditor.root.innerHTML;
        });
    }

    // Step navigation
    function showStep(stepNumber) {
        // Update step indicator
        stepItems.forEach((item, index) => {
            const step = index + 1;
            item.classList.remove('active', 'completed');

            if (step === stepNumber) {
                item.classList.add('active');
            } else if (step < stepNumber) {
                item.classList.add('completed');
            }
        });

        // Update form steps
        formSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === stepNumber) {
                step.classList.add('active');
            }
        });

        // Update button states
        prevButton.disabled = stepNumber === 1;
        nextButton.disabled = stepNumber === totalSteps;

        currentStep = stepNumber;
    }

    // Next button click - only navigate to next step
    nextButton.addEventListener('click', function() {
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    });

    // Previous button click
    prevButton.addEventListener('click', function() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });

    // List button click
    listButton.addEventListener('click', function() {
        san.confirm('목록으로 돌아가시겠습니까? 저장하지 않은 내용은 사라집니다.', function (){
            window.location.href = '/company';
        });
    });

    // Apply button click - submit form from any step
    applyButton.addEventListener('click', function() {
        handleSubmit();
    });

    // Address search button handler
    if (searchAddressButton) {
        searchAddressButton.addEventListener('click', function() {
            openDaumPostcode();
        });
    }

    // Daum Postcode API
    function openDaumPostcode() {
        new daum.Postcode({
            oncomplete: function(data) {
                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                document.getElementById('postCode').value = data.zonecode;

                // 도로명 주소와 지번 주소 중 선택
                let fullAddress = data.address; // 기본 주소
                let extraAddress = ''; // 참고 항목

                // 도로명 주소인 경우
                if (data.addressType === 'R') {
                    // 법정동명이 있을 경우 추가
                    if (data.bname !== '') {
                        extraAddress += data.bname;
                    }
                    // 건물명이 있을 경우 추가
                    if (data.buildingName !== '') {
                        extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    // 참고항목이 있을 경우 괄호로 묶어서 추가
                    fullAddress += (extraAddress !== '' ? ' (' + extraAddress + ')' : '');
                }

                // 주소 필드에 값 입력
                document.getElementById('address').value = fullAddress;

                // 상세주소 입력란으로 커서 이동
                document.getElementById('addressDetail').focus();
            }
        }).open();
    }

    // File input handlers
    logoInput.addEventListener('change', function(e) {
        handleFilePreview(e.target, logoPreview);
    });

    mainInput.addEventListener('change', function(e) {
        handleFilePreview(e.target, mainPreview);
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
        // Collect form data
        const formData = {
            // Step 1: 기본정보
            companyName: document.getElementById('companyName').value,
            companyInfo: document.getElementById('companyInfo').value,
            postCode: document.getElementById('postCode').value,
            address: document.getElementById('address').value,
            addressDetail: document.getElementById('addressDetail').value,

            // Step 2: 이미지
            logoImage: logoInput.files[0],
            mainImage: mainInput.files[0]
        };

        // Validation
        if (!formData.companyName) {
            san.warningAlert('회사명을 입력해주세요.');
            showStep(1);
            document.getElementById('companyName').focus();
            return;
        }

        if (!formData.companyInfo) {
            san.warningAlert('회사 정보를 입력해주세요.');
            showStep(1);
            quillEditor.focus();
            return;
        }

        if (!formData.postCode || !formData.address) {
            san.warningAlert('주소를 입력해주세요.');
            showStep(1);
            document.getElementById('searchAddressButton').focus();
            return;
        }

        console.log('Form data to submit:', formData);

        // TODO: API call to update company information
        // Example:
        // fetch('/api/company/update', {
        //     method: 'POST',
        //     body: JSON.stringify(formData),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        // .then(response => response.json())
        // .then(data => {
        //     alert('회사 정보가 수정되었습니다.');
        //     window.location.href = 'company.html';
        // })
        // .catch(error => {
        //     console.error('Error:', error);
        //     alert('저장 중 오류가 발생했습니다.');
        // });

        alert('회사 정보가 저장되었습니다.\n(실제 API 연동 시 저장됩니다)');
        // window.location.href = 'company.html';
    }

    // Step indicator click
    stepItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const stepNumber = index + 1;
            // Allow clicking on completed or current step
            if (stepNumber <= currentStep || item.classList.contains('completed')) {
                showStep(stepNumber);
            }
        });
    });

    // Load company data
    function loadCompanyData() {
        // API call to fetch company data
        api.get('/company')
            .then(data => {
                if (data && data.data) {
                    const company = data.data;

                    // Set basic info
                    document.getElementById('companyName').value = company.companyName || '';

                    // Set Quill editor content
                    if (quillEditor && company.companyInfo) {
                        quillEditor.root.innerHTML = company.companyInfo;
                        document.getElementById('companyInfo').value = company.companyInfo;
                    }

                    // Set address info
                    document.getElementById('postCode').value = company.postCode || '';
                    document.getElementById('address').value = company.address || '';
                    document.getElementById('addressDetail').value = company.addressDetail || '';

                    console.log('Company data loaded:', company);
                }
            })
            .catch(error => {
                console.error('Error loading company data:', error);
                san.errorAlert('회사 정보를 불러오는 중 오류가 발생했습니다.');
            });
    }

    // Initialize
    loadCompanyData();
    showStep(1);

    console.log('Company edit page initialized');
});
