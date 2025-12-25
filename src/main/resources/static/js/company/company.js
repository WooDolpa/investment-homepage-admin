// Company Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchType = document.getElementById('searchType');
    const searchKeyword = document.getElementById('searchKeyword');
    const addButton = document.getElementById('addButton');

    // Company data
    let companyData = null;

    // Load company data on page load
    loadCompanyData();

    // Custom Select
    const customSelect = document.getElementById('customSelect');
    const selectTrigger = customSelect.querySelector('.custom-select-trigger');
    const selectedValue = document.getElementById('selectedValue');
    const customOptions = customSelect.querySelectorAll('.custom-option');

    // Toggle custom select
    selectTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        customSelect.classList.toggle('open');
    });

    // Select option
    customOptions.forEach(function(option) {
        option.addEventListener('click', function(e) {
            e.stopPropagation();

            // Remove selected class from all
            customOptions.forEach(function(opt) {
                opt.classList.remove('selected');
            });

            // Add selected class to clicked option
            this.classList.add('selected');

            // Update display value
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            selectedValue.textContent = text;
            searchType.value = value;

            // Close dropdown
            customSelect.classList.remove('open');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('open');
        }
    });

    // Set initial selected
    customOptions[0].classList.add('selected');

    // Items Per Page Select
    const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
    const itemsPerPageTrigger = itemsPerPageSelect.querySelector('.custom-select-trigger');
    const selectedItemsPerPage = document.getElementById('selectedItemsPerPage');
    const itemsPerPageOptions = itemsPerPageSelect.querySelectorAll('.custom-option');

    // Toggle items per page select
    itemsPerPageTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        itemsPerPageSelect.classList.toggle('open');
    });

    // Select items per page option
    itemsPerPageOptions.forEach(function(option) {
        option.addEventListener('click', function(e) {
            e.stopPropagation();

            // Remove selected class from all
            itemsPerPageOptions.forEach(function(opt) {
                opt.classList.remove('selected');
            });

            // Add selected class to clicked option
            this.classList.add('selected');

            // Update display value
            const value = parseInt(this.getAttribute('data-value'));
            selectedItemsPerPage.textContent = value;
            itemsPerPage = value;

            // Reset to first page and update display
            currentPage = 1;
            updatePaginationDisplay();

            // Close dropdown
            itemsPerPageSelect.classList.remove('open');

            console.log('Items per page changed to:', itemsPerPage);
        });
    });

    // Close items per page dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!itemsPerPageSelect.contains(e.target)) {
            itemsPerPageSelect.classList.remove('open');
        }
    });

    /**
     * API로부터 회사 데이터 로드
     */
    function loadCompanyData() {
        api.get('/company')
            .then(data => {
                if (data && data.data) {
                    companyData = data.data;
                    renderCompanyTable(companyData);
                }
            })
            .catch(error => {
                san.errorAlert('회사 정보를 불러오는데 실패했습니다.');
            });
    }

    /**
     * 회사 데이터를 테이블에 렌더링
     */
    function renderCompanyTable(company) {
        const tableBody = document.getElementById('companyTableBody');
        tableBody.innerHTML = '';

        if (!company) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">회사 정보가 없습니다.</td></tr>';
            return;
        }

        const fullAddress = [company.address, company.addressDetail]
            .filter(addr => addr)
            .join(' ');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${company.companyName || '-'}</td>
            <td>${fullAddress || '-'}</td>           
            <td>
                <button class="action-button edit-button" title="수정" data-company-no="${company.companyNo}">
                    <span class="material-icons">edit</span>
                </button>
            </td>
        `;

        tableBody.appendChild(row);

        // Attach edit button listener
        const editButton = row.querySelector('.edit-button');
        editButton.addEventListener('click', function(e) {
            e.stopPropagation();
            handleEditCompany(company);
        });
    }

    /**
     * 회사 수정 처리
     */
    function handleEditCompany(company) {
        console.log('Edit company:', company);
        if (company && company.companyNo) {
            window.location.href = `/company/update`;
        } else {
            san.errorAlert('회사 정보를 찾을 수 없습니다.');
        }
    }

    // Search Functionality (단일 회사 정보이므로 검색 불필요 - 비활성화)
    if (searchButton) {
        searchButton.style.display = 'none';
    }
    if (searchKeyword) {
        searchKeyword.style.display = 'none';
    }
    if (customSelect) {
        customSelect.style.display = 'none';
    }

    // Add Button (단일 회사 정보이므로 추가 불필요 - 비활성화)
    if (addButton) {
        addButton.style.display = 'none';
    }

    // Pagination (단일 회사 정보이므로 페이지네이션 불필요 - 비활성화)
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
        paginationContainer.style.display = 'none';
    }

    // Items per page selector (단일 회사 정보이므로 불필요 - 비활성화)
    const itemsPerPageWrapper = document.querySelector('.items-per-page');
    if (itemsPerPageWrapper) {
        itemsPerPageWrapper.style.display = 'none';
    }

    console.log('Company page initialized');
});
