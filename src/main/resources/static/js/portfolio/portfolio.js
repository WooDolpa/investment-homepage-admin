// Portfolio Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchStatus = document.getElementById('searchStatus');
    const searchKeyword = document.getElementById('searchKeyword');
    const portfolioType = document.getElementById('portfolioType');
    const imagePreviewModal = document.getElementById('imagePreviewModal');
    const imageModalClose = document.getElementById('imageModalClose');
    const previewImage = document.getElementById('previewImage');
    const imageModalTitle = document.getElementById('imageModalTitle');

    // Pagination variables
    let currentPage = 0; // 서버 사이드 페이지네이션 (0부터 시작)
    let itemsPerPage = 10;
    let searchParams = {
        searchType: 'portfolioTitle',
        keyword: '',
        status: '',
        portfolioType: ''
    };

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

    // Type Select
    const typeSelect = document.getElementById('typeSelect');
    const typeTrigger = typeSelect.querySelector('.custom-select-trigger');
    const selectedType = document.getElementById('selectedType');
    const typeOptions = typeSelect.querySelectorAll('.custom-option');

    // Toggle type select
    typeTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        typeSelect.classList.toggle('open');
    });

    // Select type option
    typeOptions.forEach(function(option) {
        option.addEventListener('click', function(e) {
            e.stopPropagation();

            // Remove selected class from all
            typeOptions.forEach(function(opt) {
                opt.classList.remove('selected');
            });

            // Add selected class to clicked option
            this.classList.add('selected');

            // Update display value
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            selectedType.textContent = text;
            portfolioType.value = value;

            // Close dropdown
            typeSelect.classList.remove('open');

            // Automatically trigger search when type changes
            performSearch();
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!typeSelect.contains(e.target)) {
            typeSelect.classList.remove('open');
        }
    });

    // Set initial selected
    typeOptions[0].classList.add('selected');

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

            // Reset to first page and reload
            currentPage = 0;
            loadPortfolios();

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

    // 페이지 로드 시 데이터 조회
    loadPortfolios();

    // Register Button
    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', function() {
            window.location.href = '/portfolio/register';
        });
    }

    // Search Functionality
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch();
        });
    }

    // Enter key search
    if (searchKeyword) {
        searchKeyword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Perform Search
    function performSearch() {
        searchParams = {
            searchType: searchType.value,
            keyword: searchKeyword.value.trim(),
            status: searchStatus.value,
            portfolioType: portfolioType.value
        };

        // 검색 시 첫 페이지로 이동
        currentPage = 0;
        loadPortfolios();
    }

    // Load Portfolios from API
    function loadPortfolios() {
        const params = new URLSearchParams({
            searchType: searchParams.searchType || '',
            keyword: searchParams.keyword || '',
            status: searchParams.status || '',
            portfolioType: searchParams.portfolioType || '',
            page: currentPage,
            size: itemsPerPage
        });

        api.get(`/portfolio/list?${params.toString()}`)
            .then(response => {
                const data = response.data;
                if (data && data.content && data.content.length > 0) {
                    renderTable(data.content);
                    renderPagination(data.content[0]); // 첫 번째 항목에서 페이지 정보 추출
                } else {
                    renderTable([]);
                    renderEmptyPagination();
                }
            })
            .catch(error => {
                console.error('Error loading portfolios:', error);
                san.errorAlert('데이터를 불러오는 중 오류가 발생했습니다.');
                renderTable([]);
                renderEmptyPagination();
            });
    }

    // Render Table
    function renderTable(portfolios) {
        const tableBody = document.getElementById('portfolioTableBody');
        tableBody.innerHTML = '';

        if (portfolios.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
                        검색 결과가 없습니다.
                    </td>
                </tr>
            `;
            return;
        }

        portfolios.forEach(portfolio => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', portfolio.portfolioNo);
            row.setAttribute('data-title', portfolio.title);
            row.setAttribute('data-image', portfolio.imageUrl || '');
            row.setAttribute('data-status', portfolio.status);
            row.setAttribute('data-type', portfolio.portfolioType);

            // Status badge
            const statusBadgeClass = portfolio.status === 'Y' ? 'active' : 'inactive';
            const statusText = portfolio.statusStr || '-';

            // Type toggle
            const typeClass = portfolio.portfolioType === 'P' ? 'progress' : 'complete';

            row.innerHTML = `
                <td>${portfolio.title}</td>
                <td>${portfolio.orderNum || '-'}</td>
                <td><span class="status-badge ${statusBadgeClass}">${statusText}</span></td>
                <td>
                    <div class="type-toggle ${typeClass}" data-portfolio-id="${portfolio.portfolioNo}">
                        <div class="type-toggle-slider"></div>
                        <div class="type-toggle-labels">
                            <span class="type-toggle-label">진행</span>
                            <span class="type-toggle-label">완료</span>
                        </div>
                    </div>
                </td>
                <td>
                    <button class="preview-button" title="미리보기">
                        <span class="material-icons">visibility</span>
                        미리보기
                    </button>
                </td>
                <td>
                    <button class="action-button edit-button" title="수정">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="action-button delete-button" title="삭제">
                        <span class="material-icons">delete</span>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // 버튼 이벤트 재연결
        attachButtonListeners();
    }

    // Image Preview Modal Functions
    function openImageModal(imageUrl, title) {
        if(!imageUrl) {
            san.infoAlert('등록된 이미지가 없습니다.');
            return;
        }
        previewImage.src = imageUrl;
        imageModalTitle.textContent = title;
        imagePreviewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeImageModal() {
        imagePreviewModal.classList.remove('active');
        document.body.style.overflow = '';
        previewImage.src = '';
    }

    // Modal close events
    imageModalClose.addEventListener('click', closeImageModal);

    // Close modal on overlay click
    imagePreviewModal.addEventListener('click', function(e) {
        if (e.target === imagePreviewModal) {
            closeImageModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imagePreviewModal.classList.contains('active')) {
            closeImageModal();
        }
    });

    // Render Pagination
    function renderPagination(pageInfo) {
        const totalPages = pageInfo.totalPages || 0;
        const paginationNumbers = document.getElementById('paginationNumbers');
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');

        // 이전/다음 버튼 상태
        prevButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === totalPages - 1 || totalPages === 0;

        // 페이지 번호 버튼 렌더링
        paginationNumbers.innerHTML = '';

        if (totalPages === 0) return;

        for (let i = 0; i < totalPages; i++) {
            if (shouldShowPageNumber(i, currentPage, totalPages)) {
                const btn = document.createElement('button');
                btn.className = 'pagination-number';
                btn.textContent = i + 1; // 사용자에게는 1부터 표시
                if (i === currentPage) btn.classList.add('active');
                btn.addEventListener('click', () => {
                    currentPage = i;
                    loadPortfolios();
                });
                paginationNumbers.appendChild(btn);
            } else if (shouldShowEllipsis(i, currentPage, totalPages)) {
                const ellipsis = document.createElement('div');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationNumbers.appendChild(ellipsis);
            }
        }

        // 이전/다음 버튼 이벤트
        prevButton.onclick = () => {
            if (currentPage > 0) {
                currentPage--;
                loadPortfolios();
            }
        };

        nextButton.onclick = () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                loadPortfolios();
            }
        };
    }

    // Render Empty Pagination
    function renderEmptyPagination() {
        const paginationNumbers = document.getElementById('paginationNumbers');
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');

        paginationNumbers.innerHTML = '';
        prevButton.disabled = true;
        nextButton.disabled = true;
    }

    // 페이지 번호 표시 여부
    function shouldShowPageNumber(page, current, total) {
        return total <= 7 ||
               page === 0 ||
               page === total - 1 ||
               (page >= current - 1 && page <= current + 1);
    }

    // 생략 부호 표시 여부
    function shouldShowEllipsis(page, current, total) {
        return page === current - 2 || page === current + 2;
    }

    // Attach Button Listeners
    function attachButtonListeners() {
        const allRows = document.querySelectorAll('#portfolioTableBody tr');

        allRows.forEach(function(row) {
            const previewButton = row.querySelector('.preview-button');
            const editButton = row.querySelector('.edit-button');
            const deleteButton = row.querySelector('.delete-button');
            const typeToggle = row.querySelector('.type-toggle');

            // Preview button
            if (previewButton) {
                previewButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const imageUrl = row.getAttribute('data-image');
                    const title = row.getAttribute('data-title');
                    openImageModal(imageUrl, title);
                });
            }

            // Edit button
            if (editButton) {
                editButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const portfolioId = row.getAttribute('data-id');

                    console.log('Edit portfolio:', { id: portfolioId });
                    // Navigate to edit page
                    window.location.href = `/portfolio/update?portfolioNo=${portfolioId}`;
                });
            }

            // Delete button
            if (deleteButton) {
                deleteButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const portfolioId = row.getAttribute('data-id');
                    const title = row.getAttribute('data-title');

                    san.confirm(
                        `포트폴리오를 삭제하시겠습니까?`,
                        function() {
                            // Call DELETE API
                            api.delete(`/portfolio/${portfolioId}`)
                                .then(data => {
                                    console.log('Portfolio deleted successfully:', data);
                                    san.successAlert('포트폴리오가 삭제되었습니다.', function() {
                                        // Reload current page
                                        loadPortfolios();
                                    });
                                })
                                .catch(error => {
                                    console.error('Error deleting portfolio:', error);
                                    san.errorAlert('삭제 중 오류가 발생했습니다.');
                                });
                        }
                    );
                });
            }

            // Type toggle button
            if (typeToggle) {
                typeToggle.addEventListener('click', function(e) {
                    e.stopPropagation();

                    const portfolioId = this.getAttribute('data-portfolio-id');
                    const currentType = row.getAttribute('data-type');
                    const newType = currentType === 'P' ? 'C' : 'P';

                    console.log('Type toggle clicked:', {
                        portfolioId: portfolioId,
                        currentType: currentType,
                        newType: newType
                    });

                    // API 호출하여 portfolioType 업데이트
                    api.patch('/portfolio/type/update', {
                        portfolioNo: parseInt(portfolioId),
                        portfolioType: newType
                    })
                        .then(data => {
                            // 성공 시 UI 업데이트
                            row.setAttribute('data-type', newType);
                            typeToggle.classList.remove('progress', 'complete');
                            typeToggle.classList.add(newType === 'P' ? 'progress' : 'complete');
                            san.toast('타입이 변경되었습니다.', 'success', 1000);
                        })
                        .catch(error => {
                            console.error('Error updating type:', error);
                            san.errorAlert('타입 변경 중 오류가 발생했습니다.');
                        });
                });
            }
        });
    }

    console.log('Portfolio page initialized');
});
