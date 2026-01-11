// Portfolio News Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Pagination Variables
    let currentPage = 0;
    let pageSize = 10;
    let totalPages = 0;
    let totalElements = 0;

    // Selected Portfolio
    let selectedPortfolio = null;

    // Portfolio Selection Modal Elements
    const portfolioSelectionModal = document.getElementById('portfolioSelectionModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancelButton = document.getElementById('modalCancelButton');
    const modalSubmitButton = document.getElementById('modalSubmitButton');
    const modalSearchButton = document.getElementById('modalSearchButton');
    const modalSearchKeyword = document.getElementById('modalSearchKeyword');
    const modalContainer = portfolioSelectionModal ? portfolioSelectionModal.querySelector('.modal-container') : null;
    const modalHeader = portfolioSelectionModal ? portfolioSelectionModal.querySelector('.modal-header') : null;

    // Main Search Elements
    const searchButton = document.getElementById('searchButton');
    const searchKeywordInput = document.getElementById('searchKeyword');

    // Draggable Modal Variables
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Search Button - Open Modal
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            openPortfolioSelectionModal();
        });
    }

    // Modal Functions
    function openPortfolioSelectionModal() {
        if (!portfolioSelectionModal) return;

        portfolioSelectionModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset modal position (desktop only)
        xOffset = 0;
        yOffset = 0;
        if (window.innerWidth > 768 && modalContainer) {
            modalContainer.style.transform = 'translate(0px, 0px) scale(1)';
        } else if (modalContainer) {
            modalContainer.style.transform = 'scale(1)';
        }

        loadModalPortfolios();
    }

    function closePortfolioSelectionModal() {
        if (!portfolioSelectionModal) return;

        portfolioSelectionModal.classList.remove('active');
        document.body.style.overflow = '';

        // Clear search keyword
        if (modalSearchKeyword) {
            modalSearchKeyword.value = '';
        }

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
    if (modalClose) {
        modalClose.addEventListener('click', closePortfolioSelectionModal);
    }

    if (modalCancelButton) {
        modalCancelButton.addEventListener('click', closePortfolioSelectionModal);
    }

    // Close modal on overlay click
    if (portfolioSelectionModal) {
        portfolioSelectionModal.addEventListener('click', function(e) {
            if (e.target === portfolioSelectionModal) {
                closePortfolioSelectionModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && portfolioSelectionModal && portfolioSelectionModal.classList.contains('active')) {
            closePortfolioSelectionModal();
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
                if (portfolioSelectionModal && portfolioSelectionModal.classList.contains('active')) {
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
            if (modalContainer) {
                modalContainer.classList.add('dragging');
            }
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
        if (modalContainer) {
            modalContainer.classList.remove('dragging');
        }
    }

    function setTranslate(xPos, yPos, el) {
        if (el) {
            el.style.transform = `translate(${xPos}px, ${yPos}px) scale(1)`;
        }
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
                    renderModalTable(data.content, selectedPortfolio ? selectedPortfolio.portfolioNo : null);
                } else {
                    renderModalTable([], null);
                }
            })
            .catch(error => {
                console.error('Error loading modal portfolios:', error.message);
                san.errorAlert(error.message || '데이터를 불러오는 중 오류가 발생했습니다.');
                renderModalTable([], null);
            });
    }

    // Render Modal Table
    function renderModalTable(portfolios, preSelectPortfolioNo) {
        const tableBody = document.getElementById('modalPortfolioTableBody');
        const cardsContainer = document.getElementById('modalPortfolioCards');

        if (!tableBody || !cardsContainer) return;

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

            // Check if this should be pre-selected
            const isPreSelected = preSelectPortfolioNo && portfolio.portfolioNo === preSelectPortfolioNo;

            // Render Table Row (Desktop)
            const row = document.createElement('tr');
            row.setAttribute('data-portfolio-no', portfolio.portfolioNo);
            row.setAttribute('data-title', portfolio.title);
            if (isPreSelected) {
                row.classList.add('selected');
            }

            row.innerHTML = `
                <td style="text-align: center;">
                    <input type="radio" name="portfolioSelect" value="${portfolio.portfolioNo}" class="portfolio-radio" ${isPreSelected ? 'checked' : ''}>
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
            if (isPreSelected) {
                card.classList.add('selected');
            }

            card.innerHTML = `
                <div class="portfolio-card-header">
                    <input type="radio" name="portfolioSelectCard" value="${portfolio.portfolioNo}" class="portfolio-card-radio" ${isPreSelected ? 'checked' : ''}>
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

        // Store selected portfolio
        selectedPortfolio = portfolio;
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

            // Fill main search input with selected portfolio title
            if (searchKeywordInput) {
                searchKeywordInput.value = selectedPortfolio.title;
            }

            // Close modal
            closePortfolioSelectionModal();

            // Reset to first page and load news
            currentPage = 0;
            loadPortfolioNews();
        });
    }

    // Load Portfolio News
    function loadPortfolioNews() {
        if (!selectedPortfolio) {
            renderNewsTable([]);
            renderPagination();
            return;
        }

        const params = new URLSearchParams({
            page: currentPage,
            size: pageSize
        });

        api.get(`/portfolio/${selectedPortfolio.portfolioNo}/news/list?${params.toString()}`)
            .then(response => {
                const data = response.data;
                if (data) {
                    totalPages = data.totalPages || 0;
                    totalElements = data.totalElements || 0;

                    if (data.content && data.content.length > 0) {
                        renderNewsTable(data.content);
                    } else {
                        renderNewsTable([]);
                    }

                    renderPagination();
                } else {
                    renderNewsTable([]);
                    renderPagination();
                }
            })
            .catch(error => {
                console.error('Error loading portfolio news:', error.message);
                san.errorAlert(error.message || '뉴스 데이터를 불러오는 중 오류가 발생했습니다.');
                renderNewsTable([]);
                renderPagination();
            });
    }

    // Render News Table
    function renderNewsTable(newsList) {
        const tableBody = document.getElementById('portfolioTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        if (newsList.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; padding: 40px; color: #666;">
                        등록된 뉴스가 없습니다.
                    </td>
                </tr>
            `;
            return;
        }

        newsList.forEach(news => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', news.newsNo || news.id);

            row.innerHTML = `
                <td>${news.title || '-'}</td>
                <td>${news.orderNum || '-'}</td>
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

        // 버튼 이벤트 연결
        attachNewsButtonListeners();
    }

    // Render Pagination
    function renderPagination() {
        const paginationNumbers = document.getElementById('paginationNumbers');
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');

        if (!paginationNumbers || !prevButton || !nextButton) return;

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
                btn.textContent = i + 1;
                if (i === currentPage) btn.classList.add('active');
                btn.addEventListener('click', () => {
                    currentPage = i;
                    loadPortfolioNews();
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
                loadPortfolioNews();
            }
        };

        nextButton.onclick = () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                loadPortfolioNews();
            }
        };
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

    // Attach News Button Listeners
    function attachNewsButtonListeners() {
        const allRows = document.querySelectorAll('#portfolioTableBody tr');

        allRows.forEach(function(row) {
            const editButton = row.querySelector('.edit-button');
            const deleteButton = row.querySelector('.delete-button');

            // Edit button
            if (editButton) {
                editButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const newsId = row.getAttribute('data-id');
                    console.log('Edit news:', newsId);
                    // TODO: implement edit news modal
                });
            }

            // Delete button
            if (deleteButton) {
                deleteButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const newsId = row.getAttribute('data-id');

                    san.confirm(
                        '뉴스를 삭제하시겠습니까?',
                        function() {
                            // TODO: implement delete API
                            console.log('Delete news:', newsId);
                        }
                    );
                });
            }
        });
    }

    // Items Per Page Custom Select
    const itemsPerPageSelectEl = document.getElementById('itemsPerPageSelect');
    if (itemsPerPageSelectEl) {
        const itemsPerPageTrigger = itemsPerPageSelectEl.querySelector('.custom-select-trigger');
        const selectedItemsPerPage = document.getElementById('selectedItemsPerPage');
        const itemsPerPageOptions = itemsPerPageSelectEl.querySelectorAll('.custom-option');

        // Toggle items per page select
        itemsPerPageTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            itemsPerPageSelectEl.classList.toggle('open');
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
                pageSize = value;

                // Reset to first page and reload
                currentPage = 0;
                loadPortfolioNews();

                // Close dropdown
                itemsPerPageSelectEl.classList.remove('open');
            });
        });

        // Close items per page dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!itemsPerPageSelectEl.contains(e.target)) {
                itemsPerPageSelectEl.classList.remove('open');
            }
        });
    }

    // News Registration Modal Elements
    const newsRegistrationModal = document.getElementById('newsRegistrationModal');
    const newsModalClose = document.getElementById('newsModalClose');
    const newsModalCancelButton = document.getElementById('newsModalCancelButton');
    const newsModalSubmitButton = document.getElementById('newsModalSubmitButton');
    const newsModalContainer = newsRegistrationModal ? newsRegistrationModal.querySelector('.modal-container') : null;
    const newsModalHeader = document.getElementById('newsModalHeader');

    // News Form Elements
    const newsUrl = document.getElementById('newsUrl');
    const newsTitle = document.getElementById('newsTitle');
    const newsLink = document.getElementById('newsLink');
    const newsOrderNum = document.getElementById('newsOrderNum');

    // Draggable Modal Variables for News Modal
    let isNewsDragging = false;
    let newsCurrentX;
    let newsCurrentY;
    let newsInitialX;
    let newsInitialY;
    let newsXOffset = 0;
    let newsYOffset = 0;

    // Register Button - Open News Registration Modal
    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', function() {
            if (!selectedPortfolio) {
                san.warningAlert('먼저 포트폴리오를 선택해주세요.');
                return;
            }
            openNewsRegistrationModal();
        });
    }

    // News Modal Functions
    function openNewsRegistrationModal() {
        if (!newsRegistrationModal) return;

        newsRegistrationModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset modal position (desktop only)
        newsXOffset = 0;
        newsYOffset = 0;
        if (window.innerWidth > 768 && newsModalContainer) {
            newsModalContainer.style.transform = 'translate(0px, 0px) scale(1)';
        } else if (newsModalContainer) {
            newsModalContainer.style.transform = 'scale(1)';
        }

        // Clear form
        clearNewsForm();
    }

    function closeNewsRegistrationModal() {
        if (!newsRegistrationModal) return;

        newsRegistrationModal.classList.remove('active');
        document.body.style.overflow = '';

        // Clear form
        clearNewsForm();
    }

    function clearNewsForm() {
        if (newsUrl) newsUrl.value = '';
        if (newsTitle) newsTitle.value = '';
        if (newsLink) newsLink.value = '';
        if (newsOrderNum) newsOrderNum.value = '';
    }

    // Close News Modal Events
    if (newsModalClose) {
        newsModalClose.addEventListener('click', closeNewsRegistrationModal);
    }

    if (newsModalCancelButton) {
        newsModalCancelButton.addEventListener('click', closeNewsRegistrationModal);
    }

    // Close modal on overlay click
    if (newsRegistrationModal) {
        newsRegistrationModal.addEventListener('click', function(e) {
            if (e.target === newsRegistrationModal) {
                closeNewsRegistrationModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && newsRegistrationModal && newsRegistrationModal.classList.contains('active')) {
            closeNewsRegistrationModal();
        }
    });

    // Draggable News Modal Implementation
    if (newsModalHeader && newsModalContainer) {
        newsModalHeader.addEventListener('mousedown', newsModalDragStart);
        document.addEventListener('mousemove', newsModalDrag);
        document.addEventListener('mouseup', newsModalDragEnd);

        // Reset position when resizing from desktop to mobile
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768) {
                if (isNewsDragging) {
                    isNewsDragging = false;
                    newsModalContainer.classList.remove('dragging');
                }
                // Reset modal position on mobile
                if (newsRegistrationModal && newsRegistrationModal.classList.contains('active')) {
                    newsXOffset = 0;
                    newsYOffset = 0;
                    newsModalContainer.style.transform = 'scale(1)';
                }
            }
        });
    }

    function newsModalDragStart(e) {
        // Only allow dragging on desktop (screen width > 768px)
        if (window.innerWidth <= 768) {
            return;
        }

        // Don't drag if clicking on close button
        if (e.target.closest('.modal-close')) {
            return;
        }

        newsInitialX = e.clientX - newsXOffset;
        newsInitialY = e.clientY - newsYOffset;

        if (e.target === newsModalHeader || e.target.closest('.modal-header')) {
            isNewsDragging = true;
            if (newsModalContainer) {
                newsModalContainer.classList.add('dragging');
            }
        }
    }

    function newsModalDrag(e) {
        if (isNewsDragging) {
            e.preventDefault();

            newsCurrentX = e.clientX - newsInitialX;
            newsCurrentY = e.clientY - newsInitialY;

            newsXOffset = newsCurrentX;
            newsYOffset = newsCurrentY;

            setNewsModalTranslate(newsCurrentX, newsCurrentY, newsModalContainer);
        }
    }

    function newsModalDragEnd(e) {
        newsInitialX = newsCurrentX;
        newsInitialY = newsCurrentY;
        isNewsDragging = false;
        if (newsModalContainer) {
            newsModalContainer.classList.remove('dragging');
        }
    }

    function setNewsModalTranslate(xPos, yPos, el) {
        if (el) {
            el.style.transform = `translate(${xPos}px, ${yPos}px) scale(1)`;
        }
    }

    // News Modal Submit Button
    if (newsModalSubmitButton) {
        newsModalSubmitButton.addEventListener('click', function() {
            // Validate form
            if (!newsUrl || !newsUrl.value.trim()) {
                san.warningAlert('뉴스기사 URL을 입력해주세요.');
                return;
            }

            if (!newsLink || !newsLink.value.trim()) {
                san.warningAlert('뉴스기사 링크를 입력해주세요.');
                return;
            }

            if (!newsOrderNum || !newsOrderNum.value) {
                san.warningAlert('순번을 입력해주세요.');
                return;
            }

            // TODO: Implement API call to register news
            console.log('Register news:', {
                url: newsUrl.value,
                title: newsTitle.value,
                link: newsLink.value,
                orderNum: newsOrderNum.value,
                portfolioNo: selectedPortfolio.portfolioNo
            });

            san.successAlert('뉴스가 등록되었습니다.', function() {
                closeNewsRegistrationModal();
                loadPortfolioNews();
            });
        });
    }

    console.log('Portfolio news page initialized');
});
