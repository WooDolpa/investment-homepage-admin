// Portfolio Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchStatus = document.getElementById('searchStatus');
    const searchKeyword = document.getElementById('searchKeyword');
    const imagePreviewModal = document.getElementById('imagePreviewModal');
    const imageModalClose = document.getElementById('imageModalClose');
    const previewImage = document.getElementById('previewImage');
    const imageModalTitle = document.getElementById('imageModalTitle');

    // Pagination variables
    let currentPage = 1;
    let itemsPerPage = 5;
    let allRows = [];
    let filteredRows = [];

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

    // Initialize pagination
    initializePagination();

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
        const type = searchType.value;
        const status = searchStatus.value;
        const keyword = searchKeyword.value.trim();

        console.log('Searching:', {
            type: type,
            status: status,
            keyword: keyword
        });

        // TODO: Implement actual search API call
        // Filter table
        filterTable(status, keyword);
    }

    // Filter Table (Client-side simulation)
    function filterTable(status, keyword) {
        filteredRows = [];

        allRows.forEach(function(row) {
            const rowStatus = row.getAttribute('data-status');
            const rowTitle = row.getAttribute('data-title');

            // Check status filter
            let statusMatch = !status || rowStatus === status;

            // Check keyword filter
            let keywordMatch = !keyword || rowTitle.toLowerCase().includes(keyword.toLowerCase());

            if (statusMatch && keywordMatch) {
                filteredRows.push(row);
            }
        });

        console.log('Filtered results:', filteredRows.length);

        if (filteredRows.length === 0) {
            console.log('No results found');
        }

        // Reset to first page and update display
        currentPage = 1;
        updatePaginationDisplay();
    }

    // Image Preview Modal Functions
    function openImageModal(imageUrl, title) {
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

    // Initialize Pagination
    function initializePagination() {
        const tableBody = document.getElementById('portfolioTableBody');
        allRows = Array.from(tableBody.querySelectorAll('tr'));
        filteredRows = allRows.slice();

        // Pagination buttons
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');

        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                updatePaginationDisplay();
            }
        });

        nextButton.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                updatePaginationDisplay();
            }
        });

        updatePaginationDisplay();
    }

    // Update Pagination Display
    function updatePaginationDisplay() {
        const tableBody = document.getElementById('portfolioTableBody');
        const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Hide all rows
        allRows.forEach(function(row) {
            row.style.display = 'none';
        });

        // Show only current page rows
        filteredRows.slice(startIndex, endIndex).forEach(function(row) {
            row.style.display = '';
        });

        // Update pagination buttons
        updatePaginationButtons(totalPages);

        // Re-attach button listeners for visible rows
        attachButtonListeners();
    }

    // Update Pagination Buttons
    function updatePaginationButtons(totalPages) {
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
        const paginationNumbers = document.getElementById('paginationNumbers');

        // Enable/disable prev/next buttons
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages || totalPages === 0;

        // Clear pagination numbers
        paginationNumbers.innerHTML = '';

        if (totalPages === 0) return;

        // Create page number buttons
        for (let i = 1; i <= totalPages; i++) {
            // Show all pages if total pages <= 7
            // Otherwise show: 1 ... 4 5 6 ... 10
            if (
                totalPages <= 7 ||
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                const pageButton = document.createElement('button');
                pageButton.className = 'pagination-number';
                pageButton.textContent = i;

                if (i === currentPage) {
                    pageButton.classList.add('active');
                }

                pageButton.addEventListener('click', function() {
                    currentPage = i;
                    updatePaginationDisplay();
                });

                paginationNumbers.appendChild(pageButton);
            } else if (
                i === currentPage - 2 ||
                i === currentPage + 2
            ) {
                // Add ellipsis
                const ellipsis = document.createElement('div');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationNumbers.appendChild(ellipsis);
            }
        }
    }

    // Attach Button Listeners
    function attachButtonListeners() {
        const visibleRows = document.querySelectorAll('#portfolioTableBody tr[style=""], #portfolioTableBody tr:not([style*="display: none"])');

        visibleRows.forEach(function(row) {
            const previewButton = row.querySelector('.preview-button');
            const editButton = row.querySelector('.edit-button');
            const deleteButton = row.querySelector('.delete-button');

            // Preview button
            if (previewButton) {
                const newPreviewButton = previewButton.cloneNode(true);
                previewButton.parentNode.replaceChild(newPreviewButton, previewButton);

                newPreviewButton.addEventListener('click', function(e) {
                    e.stopPropagation();

                    const rowElement = this.closest('tr');
                    const imageUrl = rowElement.getAttribute('data-image');
                    const title = rowElement.getAttribute('data-title');

                    openImageModal(imageUrl, title);
                });
            }

            // Edit button
            if (editButton) {
                const newEditButton = editButton.cloneNode(true);
                editButton.parentNode.replaceChild(newEditButton, editButton);

                newEditButton.addEventListener('click', function(e) {
                    e.stopPropagation();

                    const rowElement = this.closest('tr');
                    const portfolioId = rowElement.getAttribute('data-id');
                    const title = rowElement.getAttribute('data-title');

                    console.log('Edit portfolio:', {
                        id: portfolioId,
                        title: title
                    });

                    // TODO: Navigate to edit page or open edit modal
                    alert('포트폴리오 수정:\n\n제목: ' + title);
                });
            }

            // Delete button
            if (deleteButton) {
                const newDeleteButton = deleteButton.cloneNode(true);
                deleteButton.parentNode.replaceChild(newDeleteButton, deleteButton);

                newDeleteButton.addEventListener('click', function(e) {
                    e.stopPropagation();

                    const rowElement = this.closest('tr');
                    const portfolioId = rowElement.getAttribute('data-id');
                    const title = rowElement.getAttribute('data-title');

                    if (confirm('포트폴리오를 삭제하시겠습니까?\n\n제목: ' + title)) {
                        console.log('Delete portfolio:', {
                            id: portfolioId,
                            title: title
                        });

                        // TODO: API call to delete portfolio
                        // Example:
                        // fetch('/api/portfolio/delete', {
                        //     method: 'DELETE',
                        //     headers: { 'Content-Type': 'application/json' },
                        //     body: JSON.stringify({ id: portfolioId })
                        // })
                        // .then(response => response.json())
                        // .then(data => {
                        //     alert('포트폴리오가 삭제되었습니다.');
                        //     rowElement.remove();
                        //     updatePaginationDisplay();
                        // })
                        // .catch(error => {
                        //     console.error('Error:', error);
                        //     alert('삭제 중 오류가 발생했습니다.');
                        // });

                        alert('포트폴리오가 삭제되었습니다.\n(실제 API 연동 시 삭제됩니다)');
                    }
                });
            }
        });
    }

    console.log('Portfolio page initialized');
});
