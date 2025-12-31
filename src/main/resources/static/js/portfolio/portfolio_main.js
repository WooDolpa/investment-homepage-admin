// Portfolio Main Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Pagination Variables
    let currentPage = 0;
    let pageSize = 10;
    let totalPages = 0;
    let totalElements = 0;

    // Search Variables
    let searchKeyword = '';
    let searchType = 'portfolioTitle';

    // 페이지 로드 시 데이터 조회
    loadPortfolios();

    // Search Type Custom Select
    const searchTypeSelect = document.getElementById('searchTypeSelect');
    if (searchTypeSelect) {
        const searchTypeTrigger = searchTypeSelect.querySelector('.custom-select-trigger');
        const selectedSearchType = document.getElementById('selectedSearchType');
        const searchTypeInput = document.getElementById('searchType');
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
                searchTypeInput.value = value;
                searchType = value;

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
    }

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
                loadPortfolios();

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

    // Register Modal Elements
    const registerModal = document.getElementById('registerModal');
    const registerModalClose = document.getElementById('registerModalClose');
    const modalCancelButton = document.getElementById('modalCancelButton');
    const modalSubmitButton = document.getElementById('modalSubmitButton');
    const modalSearchButton = document.getElementById('modalSearchButton');
    const modalSearchKeyword = document.getElementById('modalSearchKeyword');
    const modalContainer = registerModal.querySelector('.modal-container');
    const modalHeader = registerModal.querySelector('.modal-header');

    // Update Modal Elements
    const updateModal = document.getElementById('updateModal');
    const updateModalClose = document.getElementById('updateModalClose');
    const updateModalCancelButton = document.getElementById('updateModalCancelButton');
    const updateModalSubmitButton = document.getElementById('updateModalSubmitButton');
    const updateModalSearchButton = document.getElementById('updateModalSearchButton');
    const updateModalSearchKeyword = document.getElementById('updateModalSearchKeyword');
    const updateModalContainer = updateModal.querySelector('.modal-container');
    const updateModalHeader = updateModal.querySelector('.modal-header');

    // Selected Portfolio
    let selectedPortfolio = null;
    let selectedUpdatePortfolio = null;
    let currentEditingPortfolio = null;

    // Draggable Modal Variables (Register)
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Draggable Modal Variables (Update)
    let isUpdateDragging = false;
    let updateCurrentX;
    let updateCurrentY;
    let updateInitialX;
    let updateInitialY;
    let updateXOffset = 0;
    let updateYOffset = 0;

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
        if (e.key === 'Escape' && updateModal.classList.contains('active')) {
            closeUpdateModal();
        }
    });

    // ========== Update Modal Functions ==========

    function openUpdateModal(portfolioData) {
        currentEditingPortfolio = portfolioData;
        selectedUpdatePortfolio = null;
        updateModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset modal position (desktop only)
        updateXOffset = 0;
        updateYOffset = 0;
        if (window.innerWidth > 768) {
            updateModalContainer.style.transform = 'translate(0px, 0px) scale(1)';
        } else {
            updateModalContainer.style.transform = 'scale(1)';
        }

        // Load modal portfolios and pre-select current portfolio
        loadUpdateModalPortfolios(portfolioData.portfolioNo);
    }

    function closeUpdateModal() {
        updateModal.classList.remove('active');
        document.body.style.overflow = '';
        selectedUpdatePortfolio = null;
        currentEditingPortfolio = null;

        // Clear search keyword
        if (updateModalSearchKeyword) {
            updateModalSearchKeyword.value = '';
        }

        // Clear update form
        const updatePortfolioMainNoInput = document.getElementById('updatePortfolioMainNo');
        const updatePortfolioNoInput = document.getElementById('updatePortfolioNo');
        const updatePortfolioNoDisplayInput = document.getElementById('updatePortfolioNoDisplay');
        const updatePortfolioTitleInput = document.getElementById('updatePortfolioTitle');
        const updateDisplayOrderInput = document.getElementById('updateDisplayOrder');

        if (updatePortfolioMainNoInput) updatePortfolioMainNoInput.value = '';
        if (updatePortfolioNoInput) updatePortfolioNoInput.value = '';
        if (updatePortfolioNoDisplayInput) updatePortfolioNoDisplayInput.value = '';
        if (updatePortfolioTitleInput) updatePortfolioTitleInput.value = '';
        if (updateDisplayOrderInput) updateDisplayOrderInput.value = '';

        // Clear table selection
        const allRows = document.querySelectorAll('#updateModalPortfolioTableBody tr');
        allRows.forEach(r => r.classList.remove('selected'));

        const allRadios = document.querySelectorAll('.update-portfolio-radio');
        allRadios.forEach(r => r.checked = false);

        // Clear card selection
        const allCards = document.querySelectorAll('#updateModalPortfolioCards .portfolio-card');
        allCards.forEach(c => c.classList.remove('selected'));

        const allCardRadios = document.querySelectorAll('.update-portfolio-card-radio');
        allCardRadios.forEach(r => r.checked = false);
    }

    // Close Update Modal Events
    if (updateModalClose) {
        updateModalClose.addEventListener('click', closeUpdateModal);
    }

    if (updateModalCancelButton) {
        updateModalCancelButton.addEventListener('click', closeUpdateModal);
    }

    // Close update modal on overlay click
    updateModal.addEventListener('click', function(e) {
        if (e.target === updateModal) {
            closeUpdateModal();
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

    // Draggable Update Modal Implementation
    if (updateModalHeader && updateModalContainer) {
        updateModalHeader.addEventListener('mousedown', updateDragStart);
        document.addEventListener('mousemove', updateDrag);
        document.addEventListener('mouseup', updateDragEnd);

        // Reset position when resizing from desktop to mobile
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768) {
                if (isUpdateDragging) {
                    isUpdateDragging = false;
                    updateModalContainer.classList.remove('dragging');
                }
                // Reset modal position on mobile
                if (updateModal.classList.contains('active')) {
                    updateXOffset = 0;
                    updateYOffset = 0;
                    updateModalContainer.style.transform = 'scale(1)';
                }
            }
        });
    }

    function updateDragStart(e) {
        // Only allow dragging on desktop (screen width > 768px)
        if (window.innerWidth <= 768) {
            return;
        }

        // Don't drag if clicking on close button
        if (e.target.closest('.modal-close')) {
            return;
        }

        updateInitialX = e.clientX - updateXOffset;
        updateInitialY = e.clientY - updateYOffset;

        if (e.target === updateModalHeader || e.target.closest('.modal-header')) {
            isUpdateDragging = true;
            updateModalContainer.classList.add('dragging');
        }
    }

    function updateDrag(e) {
        if (isUpdateDragging) {
            e.preventDefault();

            updateCurrentX = e.clientX - updateInitialX;
            updateCurrentY = e.clientY - updateInitialY;

            updateXOffset = updateCurrentX;
            updateYOffset = updateCurrentY;

            setUpdateTranslate(updateCurrentX, updateCurrentY, updateModalContainer);
        }
    }

    function updateDragEnd(e) {
        updateInitialX = updateCurrentX;
        updateInitialY = updateCurrentY;
        isUpdateDragging = false;
        updateModalContainer.classList.remove('dragging');
    }

    function setUpdateTranslate(xPos, yPos, el) {
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

    // Update Modal Search
    if (updateModalSearchButton) {
        updateModalSearchButton.addEventListener('click', function() {
            performUpdateModalSearch();
        });
    }

    if (updateModalSearchKeyword) {
        updateModalSearchKeyword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performUpdateModalSearch();
            }
        });
    }

    function performUpdateModalSearch() {
        if (currentEditingPortfolio) {
            loadUpdateModalPortfolios(currentEditingPortfolio.portfolioNo);
        } else {
            loadUpdateModalPortfolios();
        }
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
                console.error('Error loading modal portfolios:', error.message);
                san.errorAlert(error.message || '데이터를 불러오는 중 오류가 발생했습니다.');
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

    // ========== Update Modal Portfolio Functions ==========

    // Load Update Modal Portfolios
    function loadUpdateModalPortfolios(preSelectPortfolioNo) {
        const keyword = updateModalSearchKeyword ? updateModalSearchKeyword.value.trim() : '';

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
                    renderUpdateModalTable(data.content, preSelectPortfolioNo);
                } else {
                    renderUpdateModalTable([], preSelectPortfolioNo);
                }
            })
            .catch(error => {
                console.error('Error loading update modal portfolios:', error.message);
                san.errorAlert(error.message || '데이터를 불러오는 중 오류가 발생했습니다.');
                renderUpdateModalTable([], preSelectPortfolioNo);
            });
    }

    // Render Update Modal Table
    function renderUpdateModalTable(portfolios, preSelectPortfolioNo) {
        const tableBody = document.getElementById('updateModalPortfolioTableBody');
        const cardsContainer = document.getElementById('updateModalPortfolioCards');

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
                    <input type="radio" name="updatePortfolioSelect" value="${portfolio.portfolioNo}" class="update-portfolio-radio" ${isPreSelected ? 'checked' : ''}>
                </td>
                <td>${portfolio.title}</td>
                <td><span class="type-badge ${typeBadgeClass}">${typeText}</span></td>
                <td><span class="status-badge ${statusBadgeClass}">${statusText}</span></td>
            `;
            tableBody.appendChild(row);

            // Row click to select
            row.addEventListener('click', function(e) {
                if (e.target.type !== 'radio') {
                    const radio = row.querySelector('.update-portfolio-radio');
                    radio.checked = true;
                }
                selectUpdateModalRow(row, portfolio);
            });

            // Radio button change event
            const radio = row.querySelector('.update-portfolio-radio');
            radio.addEventListener('change', function() {
                selectUpdateModalRow(row, portfolio);
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
                    <input type="radio" name="updatePortfolioSelectCard" value="${portfolio.portfolioNo}" class="update-portfolio-card-radio" ${isPreSelected ? 'checked' : ''}>
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
                    const cardRadio = card.querySelector('.update-portfolio-card-radio');
                    cardRadio.checked = true;
                }
                selectUpdateModalCard(card, portfolio);
            });

            // Card radio button change event
            const cardRadio = card.querySelector('.update-portfolio-card-radio');
            cardRadio.addEventListener('change', function() {
                selectUpdateModalCard(card, portfolio);
            });

            // Pre-select and fill form if this is the target portfolio
            if (isPreSelected && currentEditingPortfolio) {
                fillUpdateFormWithPortfolio(portfolio);
            }
        });
    }

    // Select Update Modal Row (Table)
    function selectUpdateModalRow(row, portfolio) {
        // Remove all previous selections from table
        const allRows = document.querySelectorAll('#updateModalPortfolioTableBody tr');
        allRows.forEach(r => r.classList.remove('selected'));

        // Remove all previous selections from cards
        const allCards = document.querySelectorAll('#updateModalPortfolioCards .portfolio-card');
        allCards.forEach(c => c.classList.remove('selected'));

        // Add selected class to current row
        row.classList.add('selected');

        // Sync card radio button
        const cardRadio = document.querySelector(`.update-portfolio-card-radio[value="${portfolio.portfolioNo}"]`);
        if (cardRadio) {
            cardRadio.checked = true;
            cardRadio.closest('.portfolio-card').classList.add('selected');
        }

        // Store selected portfolio and fill form
        fillUpdateFormWithPortfolio(portfolio);
    }

    // Select Update Modal Card (Mobile)
    function selectUpdateModalCard(card, portfolio) {
        // Remove all previous selections from cards
        const allCards = document.querySelectorAll('#updateModalPortfolioCards .portfolio-card');
        allCards.forEach(c => c.classList.remove('selected'));

        // Remove all previous selections from table
        const allRows = document.querySelectorAll('#updateModalPortfolioTableBody tr');
        allRows.forEach(r => r.classList.remove('selected'));

        // Add selected class to current card
        card.classList.add('selected');

        // Sync table radio button
        const tableRadio = document.querySelector(`.update-portfolio-radio[value="${portfolio.portfolioNo}"]`);
        if (tableRadio) {
            tableRadio.checked = true;
            tableRadio.closest('tr').classList.add('selected');
        }

        // Store selected portfolio and fill form
        fillUpdateFormWithPortfolio(portfolio);
    }

    // Fill update form with selected portfolio
    function fillUpdateFormWithPortfolio(portfolio) {
        selectedUpdatePortfolio = portfolio;

        // Auto-fill update form
        const updatePortfolioMainNoInput = document.getElementById('updatePortfolioMainNo');
        const updatePortfolioNoInput = document.getElementById('updatePortfolioNo');
        const updatePortfolioNoDisplayInput = document.getElementById('updatePortfolioNoDisplay');
        const updatePortfolioTitleInput = document.getElementById('updatePortfolioTitle');
        const updateDisplayOrderInput = document.getElementById('updateDisplayOrder');

        // Fill portfolioMainNo from current editing portfolio
        if (currentEditingPortfolio && updatePortfolioMainNoInput) {
            updatePortfolioMainNoInput.value = currentEditingPortfolio.portfolioMainNo || '';
        }

        if (updatePortfolioNoInput) {
            updatePortfolioNoInput.value = portfolio.portfolioNo;
        }
        if (updatePortfolioNoDisplayInput) {
            updatePortfolioNoDisplayInput.value = portfolio.portfolioNo;
        }
        if (updatePortfolioTitleInput) {
            updatePortfolioTitleInput.value = portfolio.title;
        }

        // Fill display order from current editing portfolio if available
        if (currentEditingPortfolio && updateDisplayOrderInput) {
            updateDisplayOrderInput.value = currentEditingPortfolio.orderNum || '';
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
                    console.error('Error registering to main:', error.message);
                    san.errorAlert(error.message || '등록 중 오류가 발생했습니다.');
                });
        });
    }

    // Update Modal Submit Button
    if (updateModalSubmitButton) {
        updateModalSubmitButton.addEventListener('click', function() {
            if (!selectedUpdatePortfolio) {
                san.warningAlert('포트폴리오를 선택해주세요.');
                return;
            }

            // Get form values
            const portfolioMainNo = document.getElementById('updatePortfolioMainNo').value;
            const portfolioNo = document.getElementById('updatePortfolioNo').value;
            const displayOrder = document.getElementById('updateDisplayOrder').value;

            // Validate portfolioMainNo
            if (!portfolioMainNo) {
                san.errorAlert('포트폴리오 메인 번호가 없습니다.');
                return;
            }

            // Validate display order
            if (!displayOrder || displayOrder < 1) {
                san.warningAlert('순번을 입력해주세요.');
                document.getElementById('updateDisplayOrder').focus();
                return;
            }

            // Call API to update
            api.put('/portfolio/main', {
                portfolioMainNo: parseInt(portfolioMainNo),
                portfolioNo: parseInt(portfolioNo),
                orderNum: parseInt(displayOrder)
            })
                .then(data => {
                    san.toast('정상적으로 수정되었습니다.', 'success', 1000);
                    closeUpdateModal();
                    loadPortfolios();
                })
                .catch(error => {
                    console.error('Error updating main portfolio:', error.message);
                    san.errorAlert(error.message || '수정 중 오류가 발생했습니다.');
                });
        });
    }

    // Load Portfolios from API
    function loadPortfolios() {
        const params = new URLSearchParams({
            page: currentPage,
            size: pageSize,
            searchType: searchType,
            keyword: searchKeyword
        });

        api.get(`/portfolio/main/list?${params.toString()}`)
            .then(response => {
                const data = response.data;
                if (data) {
                    totalPages = data.totalPages || 0;
                    totalElements = data.totalElements || 0;

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
                console.error('Error loading portfolios:', error.message);
                san.errorAlert(error.message || '데이터를 불러오는 중 오류가 발생했습니다.');
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
            row.setAttribute('data-id', portfolio.portfolioMainNo);
            row.setAttribute('data-portfolio-no', portfolio.portfolioNo);
            row.setAttribute('data-title', portfolio.portfolioTitle);

            row.innerHTML = `
                <td>${portfolio.portfolioTitle}</td>
                <td>${portfolio.orderNum || '-'}</td>
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
                btn.textContent = i + 1;
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
            const editButton = row.querySelector('.edit-button');
            const deleteButton = row.querySelector('.delete-button');

            // Edit button - Open update modal
            if (editButton) {
                editButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const portfolioMainNo = row.getAttribute('data-id');
                    const portfolioNo = row.getAttribute('data-portfolio-no');
                    const portfolioTitle = row.getAttribute('data-title');

                    // Get orderNum from the row
                    const cells = row.querySelectorAll('td');
                    const orderNum = cells[1] ? cells[1].textContent.trim() : '';

                    // Create portfolio data object
                    const portfolioData = {
                        portfolioMainNo: parseInt(portfolioMainNo),
                        portfolioNo: parseInt(portfolioNo),
                        portfolioTitle: portfolioTitle,
                        orderNum: orderNum !== '-' ? parseInt(orderNum) : null
                    };

                    // Open update modal with this data
                    openUpdateModal(portfolioData);
                });
            }

            // Delete button
            if (deleteButton) {
                deleteButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const portfolioMainNo = row.getAttribute('data-id');

                    san.confirm(
                        '포트폴리오를 메인에서 제거하시겠습니까?',
                        function() {
                            // Call DELETE API
                            api.delete(`/portfolio/main/${portfolioMainNo}`)
                                .then(data => {
                                    san.toast('정삭적으로 제거되었습니다.', 'success', 1000);
                                    loadPortfolios();
                                })
                                .catch(error => {
                                    console.error('Error removing from main:', error.message);
                                    san.errorAlert(error.message || '제거 중 오류가 발생했습니다.');
                                });
                        }
                    );
                });
            }
        });
    }

    console.log('Portfolio main page initialized');
});
