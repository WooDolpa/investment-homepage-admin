// Menu Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchStatus = document.getElementById('searchStatus');
    const searchKeyword = document.getElementById('searchKeyword');
    const editModal = document.getElementById('editModal');
    const modalClose = document.getElementById('modalClose');
    const cancelButton = document.getElementById('cancelButton');
    const updateButton = document.getElementById('updateButton');

    // Variables
    let currentEditingRow = null;

    // Search Type Select
    const searchTypeSelect = document.getElementById('searchTypeSelect');
    const searchTypeTrigger = searchTypeSelect.querySelector('.custom-select-trigger');
    const selectedSearchType = document.getElementById('selectedSearchType');
    const searchType = document.getElementById('searchType');
    const searchTypeOptions = searchTypeSelect.querySelectorAll('.custom-option');

    // Toggle search type select
    searchTypeTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        searchTypeSelect.classList.toggle('open');
    });

    // Select search type option
    searchTypeOptions.forEach(function(option) {
        option.addEventListener('click', function(e) {
            e.stopPropagation();

            // Remove selected class from all
            searchTypeOptions.forEach(function(opt) {
                opt.classList.remove('selected');
            });

            // Add selected class to clicked option
            this.classList.add('selected');

            // Update display value
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            selectedSearchType.textContent = text;
            searchType.value = value;

            // Close dropdown
            searchTypeSelect.classList.remove('open');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchTypeSelect.contains(e.target)) {
            searchTypeSelect.classList.remove('open');
        }
    });

    // Set initial selected
    searchTypeOptions[0].classList.add('selected');

    // Status Select
    const statusSelect = document.getElementById('statusSelect');
    const statusTrigger = statusSelect.querySelector('.custom-select-trigger');
    const selectedStatus = document.getElementById('selectedStatus');
    const statusOptions = statusSelect.querySelectorAll('.custom-option');

    // Toggle status select
    statusTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        statusSelect.classList.toggle('open');
    });

    // Select status option
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
            searchStatus.value = value;

            // Close dropdown
            statusSelect.classList.remove('open');

            // Automatically trigger search when status changes
            performSearch();
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!statusSelect.contains(e.target)) {
            statusSelect.classList.remove('open');
        }
    });

    // Set initial selected
    statusOptions[0].classList.add('selected');

    // Edit Status Select (in modal)
    const editStatusSelect = document.getElementById('editStatusSelect');
    const editStatusTrigger = editStatusSelect.querySelector('.custom-select-trigger');
    const selectedEditStatus = document.getElementById('selectedEditStatus');
    const editMenuStatus = document.getElementById('editMenuStatus');
    const editStatusOptions = editStatusSelect.querySelectorAll('.custom-option');

    // Toggle edit status select
    editStatusTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        editStatusSelect.classList.toggle('open');
    });

    // Select edit status option
    editStatusOptions.forEach(function(option) {
        option.addEventListener('click', function(e) {
            e.stopPropagation();

            // Remove selected class from all
            editStatusOptions.forEach(function(opt) {
                opt.classList.remove('selected');
            });

            // Add selected class to clicked option
            this.classList.add('selected');

            // Update display value
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            selectedEditStatus.textContent = text;
            editMenuStatus.value = value;

            // Close dropdown
            editStatusSelect.classList.remove('open');
        });
    });

    // Close edit status dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!editStatusSelect.contains(e.target)) {
            editStatusSelect.classList.remove('open');
        }
    });

    // Load menu data on page load
    loadMenuData();

    // Search Functionality
    searchButton.addEventListener('click', performSearch);

    // Enter key search
    searchKeyword.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Perform Search
    function performSearch() {
        const type = searchType.value;
        const status = searchStatus.value;
        const keyword = searchKeyword.value.trim();

        const params = new URLSearchParams();
        if (keyword) {
            params.append('searchType', type);
            params.append('keyword', keyword);
        }
        if (status) {
            params.append('dataStatus', status);
        }

        const queryString = params.toString();
        const endpoint = queryString ? `/menu/list?${queryString}` : '/menu/list';

        api.get(endpoint)
            .then(data => {
                if (data && data.data) {
                    renderMenuTable(data.data);
                    attachEditButtonListeners();
                }
            })
            .catch(error => {
                console.error('Error searching menu data:', error);
                san.errorAlert('메뉴 검색 중 오류가 발생했습니다.');
            });
    }

    // Modal Functions
    function openModal(row) {
        currentEditingRow = row;

        const menuName = row.getAttribute('data-name');
        const menuOrder = row.getAttribute('data-order');
        const menuStatus = row.getAttribute('data-status');

        document.getElementById('editMenuName').value = menuName;
        document.getElementById('editMenuOrder').value = menuOrder;
        document.getElementById('editMenuStatus').value = menuStatus;

        const statusText = menuStatus === 'Y' ? '사용' : '미사용';
        selectedEditStatus.textContent = statusText;

        editStatusOptions.forEach(function(option) {
            option.classList.remove('selected');
            if (option.getAttribute('data-value') === menuStatus) {
                option.classList.add('selected');
            }
        });

        editModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        editModal.classList.remove('active');
        document.body.style.overflow = '';
        currentEditingRow = null;
    }

    // Modal close events
    modalClose.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && editModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Update button
    updateButton.addEventListener('click', function() {
        const menuId = currentEditingRow.getAttribute('data-id');
        const menuName = document.getElementById('editMenuName').value.trim();
        const menuOrder = document.getElementById('editMenuOrder').value.trim();
        const menuStatus = document.getElementById('editMenuStatus').value;

        if (!menuName) {
            san.warningAlert('메뉴명을 입력해주세요.');
            document.getElementById('editMenuName').focus();
            return;
        }

        if (!menuOrder) {
            san.warningAlert('순번을 입력해주세요.');
            document.getElementById('editMenuOrder').focus();
            return;
        }

        const requestData = {
            menuId: parseInt(menuId),
            menuName: menuName,
            orderNum: parseInt(menuOrder),
            dataStatus: menuStatus
        };

        api.put('/menu', requestData)
            .then(data => {
                closeModal();
                performSearch();
                san.toast('메뉴가 수정되었습니다.', 'success');
            })
            .catch(error => {
                console.error('Error updating menu:', error);
                san.errorAlert('수정 중 오류가 발생했습니다.');
            });
    });

    // Load menu data from API
    function loadMenuData() {
        api.get('/menu/list')
            .then(data => {
                if (data && data.data) {
                    renderMenuTable(data.data);
                    attachEditButtonListeners();
                }
            })
            .catch(error => {
                console.error('Error loading menu data:', error);
                san.errorAlert('메뉴 데이터를 불러오는 중 오류가 발생했습니다.');
            });
    }

    // Render menu table
    function renderMenuTable(menuData) {
        const tableBody = document.getElementById('menuTableBody');
        tableBody.innerHTML = '';

        if (menuData.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="4" style="text-align: center; padding: 40px;">검색 결과가 없습니다.</td>';
            tableBody.appendChild(emptyRow);
            return;
        }

        menuData.forEach(menu => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', menu.menuId);
            row.setAttribute('data-name', menu.menuName);
            row.setAttribute('data-order', menu.orderNum);
            row.setAttribute('data-status', menu.dataStatus);

            const statusBadgeClass = menu.dataStatus === 'Y' ? 'active' : 'inactive';
            const statusText = menu.dataStatusStr || (menu.dataStatus === 'Y' ? '사용' : '미사용');

            row.innerHTML = `
                <td>${menu.menuName}</td>
                <td>${menu.orderNum}</td>
                <td><span class="status-badge ${statusBadgeClass}">${statusText}</span></td>
                <td>
                    <button class="action-button edit-button" title="수정">
                        <span class="material-icons">edit</span>
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Attach Edit Button Listeners
    function attachEditButtonListeners() {
        const editButtons = document.querySelectorAll('#menuTableBody .edit-button');

        editButtons.forEach(function(button) {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', function() {
                openModal(this.closest('tr'));
            });
        });
    }
});
