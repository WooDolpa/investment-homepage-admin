// Portfolio Main Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 페이지 로드 시 데이터 조회
    loadPortfolios();

    // Modal Elements
    const registerModal = document.getElementById('registerModal');
    const registerModalClose = document.getElementById('registerModalClose');
    const modalCancelButton = document.getElementById('modalCancelButton');
    const modalSubmitButton = document.getElementById('modalSubmitButton');
    const modalSearchButton = document.getElementById('modalSearchButton');
    const modalSearchKeyword = document.getElementById('modalSearchKeyword');

    // Selected Portfolio
    let selectedPortfolio = null;

    // Register Button - Open Modal
    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', function() {
            openRegisterModal();
        });
    }

    // Modal Functions
    function openRegisterModal() {
        selectedPortfolio = null;
        registerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        loadModalPortfolios();
    }

    function closeRegisterModal() {
        registerModal.classList.remove('active');
        document.body.style.overflow = '';
        selectedPortfolio = null;
        if (modalSearchKeyword) {
            modalSearchKeyword.value = '';
        }
    }

    // Close Modal Events
    if (registerModalClose) {
        registerModalClose.addEventListener('click', closeRegisterModal);
    }

    if (modalCancelButton) {
        modalCancelButton.addEventListener('click', closeRegisterModal);
    }

    // Close modal on overlay click
    registerModal.addEventListener('click', function(e) {
        if (e.target === registerModal) {
            closeRegisterModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && registerModal.classList.contains('active')) {
            closeRegisterModal();
        }
    });

    // Modal Search
    if (modalSearchButton) {
        modalSearchButton.addEventListener('click', function() {
            performModalSearch();
        });
    }

    if (modalSearchKeyword) {
        modalSearchKeyword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performModalSearch();
            }
        });
    }

    function performModalSearch() {
        loadModalPortfolios();
    }

    // Load Modal Portfolios
    function loadModalPortfolios() {
        const keyword = modalSearchKeyword ? modalSearchKeyword.value.trim() : '';

        const params = new URLSearchParams({
            searchType: 'portfolioTitle',
            keyword: keyword,
            status: '',
            portfolioType: '',
            page: 0,
            size: 100
        });

        api.get(`/portfolio/list?${params.toString()}`)
            .then(response => {
                const data = response.data;
                if (data && data.content && data.content.length > 0) {
                    renderModalTable(data.content);
                } else {
                    renderModalTable([]);
                }
            })
            .catch(error => {
                console.error('Error loading modal portfolios:', error);
                san.errorAlert('데이터를 불러오는 중 오류가 발생했습니다.');
                renderModalTable([]);
            });
    }

    // Render Modal Table
    function renderModalTable(portfolios) {
        const tableBody = document.getElementById('modalPortfolioTableBody');
        tableBody.innerHTML = '';

        if (portfolios.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 40px; color: #666;">
                        검색 결과가 없습니다.
                    </td>
                </tr>
            `;
            return;
        }

        portfolios.forEach(portfolio => {
            const row = document.createElement('tr');
            row.setAttribute('data-portfolio-no', portfolio.portfolioNo);
            row.setAttribute('data-title', portfolio.title);

            // Type badge
            const typeBadgeClass = portfolio.portfolioType === 'P' ? 'progress' : 'complete';
            const typeText = portfolio.portfolioType === 'P' ? '진행' : '완료';

            // Status badge
            const statusBadgeClass = portfolio.status === 'Y' ? 'active' : 'inactive';
            const statusText = portfolio.statusStr || '-';

            row.innerHTML = `
                <td style="text-align: center;">
                    <input type="radio" name="portfolioSelect" value="${portfolio.portfolioNo}" class="portfolio-radio">
                </td>
                <td>${portfolio.title}</td>
                <td><span class="type-badge ${typeBadgeClass}">${typeText}</span></td>
                <td><span class="status-badge ${statusBadgeClass}">${statusText}</span></td>
            `;
            tableBody.appendChild(row);

            // Row click to select
            row.addEventListener('click', function(e) {
                // 라디오 버튼 클릭이 아닌 경우에만 처리
                if (e.target.type !== 'radio') {
                    const radio = row.querySelector('.portfolio-radio');
                    radio.checked = true;
                }
                selectModalRow(row, portfolio);
            });

            // Radio button change event
            const radio = row.querySelector('.portfolio-radio');
            radio.addEventListener('change', function() {
                selectModalRow(row, portfolio);
            });
        });
    }

    // Select Modal Row
    function selectModalRow(row, portfolio) {
        // Remove all previous selections
        const allRows = document.querySelectorAll('#modalPortfolioTableBody tr');
        allRows.forEach(r => r.classList.remove('selected'));

        // Add selected class to current row
        row.classList.add('selected');

        // Store selected portfolio
        selectedPortfolio = portfolio;
    }

    // Modal Submit Button
    if (modalSubmitButton) {
        modalSubmitButton.addEventListener('click', function() {
            if (!selectedPortfolio) {
                san.warningAlert('포트폴리오를 선택해주세요.');
                return;
            }

            // Call API to register to main
            api.post('/portfolio/main', {
                portfolioNo: selectedPortfolio.portfolioNo
            })
                .then(data => {
                    san.successAlert('메인에 등록되었습니다.', function() {
                        closeRegisterModal();
                        loadPortfolios();
                    });
                })
                .catch(error => {
                    console.error('Error registering to main:', error);
                    san.errorAlert('등록 중 오류가 발생했습니다.');
                });
        });
    }

    // Load Portfolios from API
    function loadPortfolios() {
        api.get('/portfolio/main/list')
            .then(response => {
                const data = response.data;
                if (data && data.content && data.content.length > 0) {
                    renderTable(data.content);
                } else {
                    renderTable([]);
                }
            })
            .catch(error => {
                console.error('Error loading portfolios:', error);
                san.errorAlert('데이터를 불러오는 중 오류가 발생했습니다.');
                renderTable([]);
            });
    }

    // Render Table
    function renderTable(portfolios) {
        const tableBody = document.getElementById('portfolioTableBody');
        tableBody.innerHTML = '';

        if (portfolios.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 40px; color: #666;">
                        등록된 포트폴리오가 없습니다.
                    </td>
                </tr>
            `;
            return;
        }

        portfolios.forEach(portfolio => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', portfolio.portfolioNo);
            row.setAttribute('data-title', portfolio.title);

            // Status badge
            const statusBadgeClass = portfolio.status === 'Y' ? 'active' : 'inactive';
            const statusText = portfolio.statusStr || '-';

            row.innerHTML = `
                <td>${portfolio.title}</td>
                <td>${portfolio.orderNum || '-'}</td>
                <td><span class="status-badge ${statusBadgeClass}">${statusText}</span></td>
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

    // Attach Button Listeners
    function attachButtonListeners() {
        const allRows = document.querySelectorAll('#portfolioTableBody tr');

        allRows.forEach(function(row) {
            const editButton = row.querySelector('.edit-button');
            const deleteButton = row.querySelector('.delete-button');

            // Edit button
            if (editButton) {
                editButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const portfolioId = row.getAttribute('data-id');
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
                        `"${title}" 포트폴리오를 메인에서 제거하시겠습니까?`,
                        function() {
                            // Call DELETE API
                            api.delete(`/portfolio/main/${portfolioId}`)
                                .then(data => {
                                    san.successAlert('메인에서 제거되었습니다.', function() {
                                        // Reload list
                                        loadPortfolios();
                                    });
                                })
                                .catch(error => {
                                    console.error('Error removing from main:', error);
                                    san.errorAlert('제거 중 오류가 발생했습니다.');
                                });
                        }
                    );
                });
            }
        });
    }

    console.log('Portfolio main page initialized');
});
