// Portfolio Main Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Pagination Variables
    let currentPage = 0;
    let pageSize = 10;
    let totalPages = 0;
    let totalElements = 0;

    // Search Variables
    let searchKeyword = '';

    // 페이지 로드 시 데이터 조회
    loadPortfolios();

    // Search Button Click Event
    const searchButton = document.getElementById('searchButton');
    const searchKeywordInput = document.getElementById('searchKeyword');

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch();
        });
    }

    // Enter key on search input
    if (searchKeywordInput) {
        searchKeywordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Perform Search
    function performSearch() {
        searchKeyword = searchKeywordInput ? searchKeywordInput.value.trim() : '';
        currentPage = 0;
        loadPortfolios();
    }

    // Items Per Page Change Event
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', function() {
            pageSize = parseInt(this.value);
            currentPage = 0;
            loadPortfolios();
        });
    }

    // Modal Elements
    const registerModal = document.getElementById('registerModal');
    const registerModalClose = document.getElementById('registerModalClose');
    const modalCancelButton = document.getElementById('modalCancelButton');
    const modalSubmitButton = document.getElementById('modalSubmitButton');
    const modalSearchButton = document.getElementById('modalSearchButton');
    const modalSearchKeyword = document.getElementById('modalSearchKeyword');
    const modalContainer = registerModal.querySelector('.modal-container');
    const modalHeader = registerModal.querySelector('.modal-header');

    // Selected Portfolio
    let selectedPortfolio = null;

    // Draggable Modal Variables
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

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

        // Reset modal position (desktop only)
        xOffset = 0;
        yOffset = 0;
        if (window.innerWidth > 768) {
            modalContainer.style.transform = 'translate(0px, 0px) scale(1)';
        } else {
            modalContainer.style.transform = 'scale(1)';
        }

        loadModalPortfolios();
    }

    function closeRegisterModal() {
        registerModal.classList.remove('active');
        document.body.style.overflow = '';
        selectedPortfolio = null;

        // Clear search keyword
        if (modalSearchKeyword) {
            modalSearchKeyword.value = '';
        }

        // Clear registration form
        const portfolioNoInput = document.getElementById('portfolioNo');
        const portfolioNoDisplayInput = document.getElementById('portfolioNoDisplay');
        const portfolioTitleInput = document.getElementById('portfolioTitle');
        const displayOrderInput = document.getElementById('displayOrder');

        if (portfolioNoInput) portfolioNoInput.value = '';
        if (portfolioNoDisplayInput) portfolioNoDisplayInput.value = '';
        if (portfolioTitleInput) portfolioTitleInput.value = '';
        if (displayOrderInput) displayOrderInput.value = '';

        // Clear table selection
        const allRows = document.querySelectorAll('#modalPortfolioTableBody tr');
        allRows.forEach(r => r.classList.remove('selected'));

        const allRadios = document.querySelectorAll('.portfolio-radio');
        allRadios.forEach(r => r.checked = false);

        // Clear card selection
        const allCards = document.querySelectorAll('.portfolio-card');
        allCards.forEach(c => c.classList.remove('selected'));

        const allCardRadios = document.querySelectorAll('.portfolio-card-radio');
        allCardRadios.forEach(r => r.checked = false);
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

    // Draggable Modal Implementation
    if (modalHeader && modalContainer) {
        modalHeader.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // Reset position when resizing from desktop to mobile
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768) {
                if (isDragging) {
                    isDragging = false;
                    modalContainer.classList.remove('dragging');
                }
                // Reset modal position on mobile
                if (registerModal.classList.contains('active')) {
                    xOffset = 0;
                    yOffset = 0;
                    modalContainer.style.transform = 'scale(1)';
                }
            }
        });
    }

    function dragStart(e) {
        // Only allow dragging on desktop (screen width > 768px)
        if (window.innerWidth <= 768) {
            return;
        }

        // Don't drag if clicking on close button
        if (e.target.closest('.modal-close')) {
            return;
        }

        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === modalHeader || e.target.closest('.modal-header')) {
            isDragging = true;
            modalContainer.classList.add('dragging');
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, modalContainer);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        modalContainer.classList.remove('dragging');
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px) scale(1)`;
    }

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
            status: 'Y',
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
        const cardsContainer = document.getElementById('modalPortfolioCards');

        tableBody.innerHTML = '';
        cardsContainer.innerHTML = '';

        if (portfolios.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 40px; color: #666;">
                        검색 결과가 없습니다.
                    </td>
                </tr>
            `;
            cardsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    검색 결과가 없습니다.
                </div>
            `;
            return;
        }

        portfolios.forEach(portfolio => {
            // Type badge
            const typeBadgeClass = portfolio.portfolioType === 'P' ? 'progress' : 'complete';
            const typeText = portfolio.portfolioType === 'P' ? '진행' : '완료';

            // Status badge
            const statusBadgeClass = portfolio.status === 'Y' ? 'active' : 'inactive';
            const statusText = portfolio.statusStr || '-';

            // Render Table Row (Desktop)
            const row = document.createElement('tr');
            row.setAttribute('data-portfolio-no', portfolio.portfolioNo);
            row.setAttribute('data-title', portfolio.title);

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

            // Render Card (Mobile)
            const card = document.createElement('div');
            card.className = 'portfolio-card';
            card.setAttribute('data-portfolio-no', portfolio.portfolioNo);
            card.setAttribute('data-title', portfolio.title);

            card.innerHTML = `
                <div class="portfolio-card-header">
                    <input type="radio" name="portfolioSelectCard" value="${portfolio.portfolioNo}" class="portfolio-card-radio">
                    <div class="portfolio-card-title">${portfolio.title}</div>
                </div>
                <div class="portfolio-card-info">
                    <div class="portfolio-card-info-item">
                        <span class="portfolio-card-info-label">타입:</span>
                        <span class="type-badge ${typeBadgeClass}">${typeText}</span>
                    </div>
                    <div class="portfolio-card-info-item">
                        <span class="portfolio-card-info-label">상태:</span>
                        <span class="status-badge ${statusBadgeClass}">${statusText}</span>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(card);

            // Card click to select
            card.addEventListener('click', function(e) {
                if (e.target.type !== 'radio') {
                    const cardRadio = card.querySelector('.portfolio-card-radio');
                    cardRadio.checked = true;
                }
                selectModalCard(card, portfolio);
            });

            // Card radio button change event
            const cardRadio = card.querySelector('.portfolio-card-radio');
            cardRadio.addEventListener('change', function() {
                selectModalCard(card, portfolio);
            });
        });
    }

    // Select Modal Row (Table)
    function selectModalRow(row, portfolio) {
        // Remove all previous selections from table
        const allRows = document.querySelectorAll('#modalPortfolioTableBody tr');
        allRows.forEach(r => r.classList.remove('selected'));

        // Remove all previous selections from cards
        const allCards = document.querySelectorAll('.portfolio-card');
        allCards.forEach(c => c.classList.remove('selected'));

        // Add selected class to current row
        row.classList.add('selected');

        // Sync card radio button
        const cardRadio = document.querySelector(`.portfolio-card-radio[value="${portfolio.portfolioNo}"]`);
        if (cardRadio) {
            cardRadio.checked = true;
            cardRadio.closest('.portfolio-card').classList.add('selected');
        }

        // Store selected portfolio and fill form
        fillFormWithPortfolio(portfolio);
    }

    // Select Modal Card (Mobile)
    function selectModalCard(card, portfolio) {
        // Remove all previous selections from cards
        const allCards = document.querySelectorAll('.portfolio-card');
        allCards.forEach(c => c.classList.remove('selected'));

        // Remove all previous selections from table
        const allRows = document.querySelectorAll('#modalPortfolioTableBody tr');
        allRows.forEach(r => r.classList.remove('selected'));

        // Add selected class to current card
        card.classList.add('selected');

        // Sync table radio button
        const tableRadio = document.querySelector(`.portfolio-radio[value="${portfolio.portfolioNo}"]`);
        if (tableRadio) {
            tableRadio.checked = true;
            tableRadio.closest('tr').classList.add('selected');
        }

        // Store selected portfolio and fill form
        fillFormWithPortfolio(portfolio);
    }

    // Fill form with selected portfolio
    function fillFormWithPortfolio(portfolio) {
        selectedPortfolio = portfolio;

        // Auto-fill registration form
        const portfolioNoInput = document.getElementById('portfolioNo');
        const portfolioNoDisplayInput = document.getElementById('portfolioNoDisplay');
        const portfolioTitleInput = document.getElementById('portfolioTitle');

        if (portfolioNoInput) {
            portfolioNoInput.value = portfolio.portfolioNo;
        }
        if (portfolioNoDisplayInput) {
            portfolioNoDisplayInput.value = portfolio.portfolioNo;
        }
        if (portfolioTitleInput) {
            portfolioTitleInput.value = portfolio.title;
        }
    }

    // Modal Submit Button
    if (modalSubmitButton) {
        modalSubmitButton.addEventListener('click', function() {
            if (!selectedPortfolio) {
                san.warningAlert('포트폴리오를 선택해주세요.');
                return;
            }

            // Get form values
            const portfolioNo = document.getElementById('portfolioNo').value;
            const displayOrder = document.getElementById('displayOrder').value;

            // Validate display order
            if (!displayOrder || displayOrder < 1) {
                san.warningAlert('순번을 입력해주세요.');
                document.getElementById('displayOrder').focus();
                return;
            }

            // Call API to register to main
            api.post('/portfolio/main', {
                portfolioNo: parseInt(portfolioNo),
                orderNum: parseInt(displayOrder)
            })
                .then(data => {
                    san.toast('', 'success', 1000);
                    closeRegisterModal();
                    loadPortfolios();
                })
                .catch(error => {
                    console.error('Error registering to main:', error);
                    san.errorAlert('등록 중 오류가 발생했습니다.');
                });
        });
    }

    // Load Portfolios from API
    function loadPortfolios() {
        const params = new URLSearchParams({
            page: currentPage,
            size: pageSize,
            keyword: searchKeyword
        });

        api.get(`/portfolio/main/list?${params.toString()}`)
            .then(response => {
                const data = response.data;
                if (data) {
                    totalPages = data.totalPages || 0;
                    totalElements = data.totalElements || 0;

                    // Update total count
                    const totalCountEl = document.getElementById('totalCount');
                    if (totalCountEl) {
                        totalCountEl.textContent = totalElements;
                    }

                    if (data.content && data.content.length > 0) {
                        renderTable(data.content);
                    } else {
                        renderTable([]);
                    }

                    // Render pagination
                    renderPagination();
                } else {
                    renderTable([]);
                    renderPagination();
                }
            })
            .catch(error => {
                console.error('Error loading portfolios:', error);
                san.errorAlert('데이터를 불러오는 중 오류가 발생했습니다.');
                renderTable([]);
                renderPagination();
            });
    }

    // Render Table
    function renderTable(portfolios) {
        const tableBody = document.getElementById('portfolioTableBody');
        tableBody.innerHTML = '';

        if (portfolios.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; padding: 40px; color: #666;">
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

            row.innerHTML = `
                <td>${portfolio.title}</td>
                <td>${portfolio.displayOrder || '-'}</td>
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

    // Render Pagination
    function renderPagination() {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';

        if (totalPages <= 0) {
            return;
        }

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = '이전';
        prevButton.disabled = currentPage === 0;
        prevButton.addEventListener('click', function() {
            if (currentPage > 0) {
                currentPage--;
                loadPortfolios();
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page buttons
        const startPage = Math.max(0, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i + 1;
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', function() {
                currentPage = i;
                loadPortfolios();
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = '다음';
        nextButton.disabled = currentPage === totalPages - 1;
        nextButton.addEventListener('click', function() {
            if (currentPage < totalPages - 1) {
                currentPage++;
                loadPortfolios();
            }
        });
        paginationContainer.appendChild(nextButton);

        // Page info
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `${currentPage + 1} / ${totalPages} 페이지`;
        paginationContainer.appendChild(pageInfo);
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
