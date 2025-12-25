// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const logoutButton = document.getElementById('logoutButton');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sidebar Toggle
    const mainContent = document.querySelector('.main-content');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if (window.innerWidth > 1024) {
                // Desktop: Toggle collapsed mode
                sidebar.classList.toggle('collapsed');
                if (mainContent) {
                    mainContent.classList.toggle('sidebar-collapsed');
                }
            } else {
                // Mobile/Tablet: Toggle active (show/hide)
                sidebar.classList.toggle('active');
                menuToggle.classList.toggle('active');
            }
        });
    }

    // Sidebar Hover Effect (Desktop only)
    if (sidebar) {
        sidebar.addEventListener('mouseenter', function() {
            if (window.innerWidth > 1024 && sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('hover');
                if (mainContent) {
                    mainContent.classList.add('sidebar-hover');
                }
            }
        });

        sidebar.addEventListener('mouseleave', function() {
            if (window.innerWidth > 1024 && sidebar.classList.contains('collapsed')) {
                sidebar.classList.remove('hover');
                if (mainContent) {
                    mainContent.classList.remove('sidebar-hover');
                }
            }
        });
    }

    // Close sidebar when clicking outside (mobile/tablet only)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });

    // Navigation Menu Click
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const parentItem = this.parentElement;
            const hasSubmenu = parentItem.classList.contains('has-submenu');

            if (hasSubmenu) {

                // Close all other submenus
                document.querySelectorAll('.nav-item.has-submenu').forEach(function(item) {
                    if (item !== parentItem) {
                        item.classList.remove('open');
                    }
                });

                // Toggle current submenu
                parentItem.classList.toggle('open');

            } else {
                // Remove active class from all items
                document.querySelectorAll('.nav-item').forEach(function(item) {
                    item.classList.remove('active');
                });
                document.querySelectorAll('.submenu-item').forEach(function(item) {
                    item.classList.remove('active');
                });

                // Add active class to clicked item
                parentItem.classList.add('active');

                // Close sidebar on mobile after click
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('active');
                    menuToggle.classList.remove('active');
                }

                // Get menu name
                const menuText = this.querySelector('.nav-text').textContent;
                console.log('Navigating to:', menuText);

            }
        });
    });

    // Submenu Link Click
    const submenuLinks = document.querySelectorAll('.submenu-link');
    submenuLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active from all menu items
            document.querySelectorAll('.nav-item').forEach(function(item) {
                item.classList.remove('active');
            });
            document.querySelectorAll('.submenu-item').forEach(function(item) {
                item.classList.remove('active');
            });

            // Add active to current submenu item
            this.parentElement.classList.add('active');

            // Close sidebar on mobile after click
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
            }

            // Get submenu name
            const submenuText = this.textContent;
            console.log('Navigating to submenu:', submenuText);

            // Navigate to the href URL
            const url = this.getAttribute('href');
            if (url) {
                window.location.href = url;
            }
        });
    });

    // Logout Handler
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            const confirmed = confirm('로그아웃 하시겠습니까?');

            if (confirmed) {
                // TODO: Add logout logic here
                // Example: Clear session, redirect to login
                console.log('Logging out...');

                // Redirect to login page
                window.location.href = 'index.html';
            }
        });
    }

    // View All Button
    const viewAllButton = document.querySelector('.view-all-button');
    if (viewAllButton) {
        viewAllButton.addEventListener('click', function() {
            console.log('View all activities clicked');
            // TODO: Navigate to full activity log page
        });
    }

    // Table Row Click
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    tableRows.forEach(function(row) {
        row.addEventListener('click', function() {
            console.log('Row clicked:', this.cells[2].textContent);
            // TODO: Show detail modal or navigate to detail page
        });

        // Add pointer cursor style
        row.style.cursor = 'pointer';
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 1024) {
                // Desktop: Remove mobile active state
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
            } else {
                // Mobile/Tablet: Remove desktop collapsed state
                sidebar.classList.remove('collapsed');
                if (mainContent) {
                    mainContent.classList.remove('sidebar-collapsed');
                }
            }
        }, 250);
    });

    // Animate stat cards on page load
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(function(card, index) {
        setTimeout(function() {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';

            setTimeout(function() {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });

    // Update stats periodically (demo)
    function updateStats() {
        const statValues = document.querySelectorAll('.stat-value');

        statValues.forEach(function(stat) {
            // Skip if not a number
            const currentValue = stat.textContent.replace(/[^0-9]/g, '');
            if (currentValue) {
                // Add pulse animation
                stat.style.animation = 'pulse 0.5s ease';
                setTimeout(function() {
                    stat.style.animation = '';
                }, 500);
            }
        });
    }

    // Update stats every 30 seconds (optional)
    // setInterval(updateStats, 30000);

    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);

    // Log initialization
    console.log('Dashboard initialized successfully');
});
