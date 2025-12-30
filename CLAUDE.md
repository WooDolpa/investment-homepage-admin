# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spring Boot 3.5.7 admin application for an investment homepage system. It depends on a shared library `investment-homepage-common:1.0` from mavenLocal that contains shared entities and common functionality.

**Key Technologies:**
- Java 17
- Spring Boot 3.5.7 (Web, JPA, Security, Thymeleaf)
- QueryDSL 5.0.0
- JWT (jjwt 0.12.5)
- MariaDB
- Gradle

## Build and Run Commands

### Build the project
```bash
./gradlew build
```

### Clean build (removes QueryDSL generated classes)
```bash
./gradlew clean build
```

### Run the application (local profile)
```bash
./gradlew bootRun
```

### Run with specific profile
```bash
./gradlew bootRun -Pprofile=local
```

### Run tests
```bash
./gradlew test
```

## Project Structure

```
src/main/java/san/investment/admin/
├── config/          - Configuration classes (Security, JPA, QueryDSL, Beans)
├── controller/
│   ├── api/         - REST API controllers (@RestController)
│   └── view/        - View controllers (@Controller)
├── dto/             - Data Transfer Objects
├── filter/          - Servlet filters (AuthenticationFilter)
├── http/            - Custom HTTP wrappers (CustomHttpServletRequest)
├── repository/      - JPA repositories
├── security/        - Security components (CustomUserDetailService)
├── service/         - Business logic services
└── utils/           - Utility classes (JWTUtil)
```

## Architecture Notes

### Multi-Module Structure
- This admin application depends on `investment-homepage-common:1.0` which must be installed in mavenLocal
- Shared entities are located in `san.investment.common.entity` package (from common module)
- Shared components and utilities are in `san.investment.common` package
- Shared constants (ApiConstants, ExceptionCode, etc.) are in the common module
- `@EntityScan` scans `san.investment.common.entity` for entities
- `@ComponentScan` scans both `san.investment.admin` and `san.investment.common` for Spring components

### Profile-Based Configuration
- Profile is configured in build.gradle (line 58)
- Default profile is 'local'
- Resources are loaded from `src/main/resources/{profile}/`
- Environment variables required:
  - Database: `MARIADB_URL`, `MARIADB_USERNAME`, `MARIADB_PASSWORD`
  - JWT: `JWT_SECRET_KEY` (used for token signing)
  - File Upload: `FILE_SAVE_URL` (base directory for uploaded files)

### QueryDSL Setup
- Generated Q-classes are placed in `src/main/generated`
- Clean task removes all generated Q-classes (build.gradle line 55)
- JPAQueryFactory is configured in QueryDSLConfig.java

### Security Architecture
- JWT-based authentication (stateless sessions)
- Custom AuthenticationFilter validates JWT on every request
- CustomHttpServletRequest wrapper injects admin info into request headers
- Public endpoints: `/js/**`, `/css/**`, `/image/**`, `/scss/**`, `/uploads/**`, `/favicon.ico`, `/.well-known/**`
- Public routes: `GET /`, `GET /login`, `GET /company`, `POST /v1/auth/login`, `POST /v1/auth/logout`, `GET /v1/auth/password`
- All other endpoints require authentication
- CORS configured with `http://localhost:8080` (SecurityConfig.java:65)
- BCrypt password encoding

### JWT Implementation
- Access token expiration: 30 minutes (1,800 seconds)
- Secret key loaded from environment variable `JWT_SECRET_KEY`
- Access token contains: loginId (subject), id (claim), adminName (claim)
- JWTUtil provides `getExpirationAsLocalDateTime()` to extract expiration from tokens
- **Timezone**: Token expiration dates are converted to "Asia/Seoul" timezone (JWTUtil.java:152)

### Authentication Flow
1. **Login:**
   - User submits credentials to `/v1/auth/login`
   - AuthService validates against database (BCrypt)
   - JWT generated with 30-minute expiration containing loginId, id, adminName
   - Token stored in HttpOnly cookie named `token`
   - SecurityContext populated with authentication

2. **Logout:**
   - Client calls `/v1/auth/logout`
   - SecurityContext cleared
   - Token cookie deleted (maxAge=0)
   - **Note:** Token remains valid until expiration (stateless JWT limitation)

3. **Protected Requests:**
   - Token sent via cookie
   - AuthenticationFilter intercepts and validates JWT (AuthenticationFilter.java:82)
   - If invalid, redirects to `/login` and clears cookie
   - If valid, extracts loginId and adminName from JWT
   - CustomHttpServletRequest wraps original request and injects headers:
     - `ApiConstants.REQUEST_HEADER_ADMIN_ID` - Admin login ID
     - `ApiConstants.REQUEST_HEADER_ADMIN_NAME` - Admin name
   - SecurityContext populated with UserDetails
   - Request proceeds with injected admin info in headers

4. **Accessing Admin Info in Controllers:**
   - View controllers can access admin info from request headers:
     ```java
     String adminName = request.getHeader(ApiConstants.REQUEST_HEADER_ADMIN_NAME);
     model.addAttribute("adminName", adminName);
     ```

## Development Notes

### When Working with Entities
- Entity classes are in the common module (`san.investment.common.entity`)
- Do not create entity classes in this module - they belong in the common module
- After modifying entities in the common module:
  1. Build the common module and install to mavenLocal: `./gradlew publishToMavenLocal`
  2. Rebuild this admin module with QueryDSL Q-classes: `./gradlew clean build`
- For composite primary keys, use either `@IdClass` or `@EmbeddedId` approach

### When Working with Security
- AuthenticationFilter is fully implemented with JWT validation
- JWTUtil provides token generation and validation utilities
- Use CustomHttpServletRequest to inject custom headers in filters
- Access admin info from request headers using ApiConstants from common module

### Database
- JPA auditing is enabled (JpaConfig.java)
- Hibernate DDL auto is set to 'none' - database schema is managed manually
- SQL logging is enabled in local profile (includes SQL, bind parameters, and result extraction)
- HikariCP connection pooling configured (min idle 5, idle timeout 60000ms)
- **Important**: All date/time operations use Asia/Seoul timezone

### File Upload Architecture
- **Storage**: Files are physically saved to `${FILE_SAVE_URL}/subdirectory/filename`
- **URL Mapping**: WebMvcConfig maps `/uploads/**` to the file system directory
- **FileUtil**: Returns web-accessible paths (e.g., `/uploads/company/1/logo.png`) instead of absolute file system paths
- **Security**: `/uploads/**` is publicly accessible (configured in SecurityConfig)
- **Multipart Config**: Max file size 500MB, max request size 500MB (application.yml)
- **Path Convention**: `file.company.url: company/` - subdirectory for company-related files

**File Upload Pattern:**
```java
// Controller
@PutMapping
public ResponseEntity<String> updateCompany(
    @RequestPart(value = "logoFile", required = false) MultipartFile logoFile,
    @RequestPart(value = "mainFile", required = false) MultipartFile mainFile,
    @RequestPart(value = "jsonBody") String jsonBody) {
    // Parse JSON and call service
}

// Service
String subDirectory = companyUrl.concat(String.valueOf(companyNo)); // "company/1"
String fileUrl = fileUtil.saveFile(file, subDirectory); // Returns "/uploads/company/1/filename.ext"
entity.changeLogoUrl(fileUrl); // Save web path to database
```

## Frontend Architecture

### Template Structure (Thymeleaf)
- Templates located in `src/main/resources/templates/`
- Fragment system for reusable components:
  - `fragments/common.html` - Head section with CSS/font imports
  - `fragments/header.html` - Sidebar and navbar fragments
  - `fragments/scripts.html` - JavaScript imports
- Main pages: `login/login.html`, `company/company.html`

### Menu System (header.html)
- Dynamic menu activation using Thymeleaf conditionals:
  - `${menuActive}` - Determines which top-level menu is expanded
  - `${subMenuActive}` - Determines which sub-menu item is highlighted
- Example menu item with icon:
  ```html
  <a data-bs-toggle="collapse" href="#company" class="nav-link text-dark">
      <i class="material-symbols-rounded opacity-5">enterprise</i>
      <span class="nav-link-text ms-1 ps-1">회사</span>
  </a>
  ```

### Icon System
- **Material Symbols Rounded** - Primary icon system loaded from Google Fonts (common.html:16)
  - Usage: `<i class="material-symbols-rounded">icon_name</i>`
  - Icon names from https://fonts.google.com/icons
  - Examples: `enterprise`, `logout`, `corporate_fare`
- **Font Awesome 6.7.1** - Secondary icon system via CDN (common.html:14)
  - Usage: `<i class="fa fa-icon-name"></i>`

### JavaScript Organization
```
src/main/resources/static/js/
├── material-dashboard.js  - Core dashboard functionality (sidebar toggle, etc.)
├── common.js              - SweetAlert2 wrapper utilities (san object)
├── api.js                 - API request utilities (api object)
├── auth.js                - Authentication helpers
├── common/navbar.js       - Navbar event handlers (logout, etc.)
└── login/login_cc.js         - Login page logic
```

### Frontend Utilities

**san object** (common.js) - SweetAlert2-based dialogs:
- `san.warningAlert(message)` - Warning dialog
- `san.errorAlert(message)` - Error dialog
- `san.successAlert(message, callback)` - Success dialog with optional callback
- `san.infoAlert(message)` - Info dialog
- `san.confirm(message, confirmCallback, cancelCallback)` - Confirmation dialog

**Custom styling:** SweetAlert2 uses custom classes defined in `custom.css`:
- `.swal-popup-custom` - Popup container
- `.swal-text-default` - Text content
- `.btn-alert` - Button styling

**api object** (api.js) - HTTP request wrapper:
```javascript
// GET request
api.get('/endpoint')

// POST request with JSON
api.post('/endpoint', { data: 'value' })

// PUT request with FormData (for file uploads)
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('jsonBody', new Blob([JSON.stringify(data)], { type: 'application/json' }));
api.put('/endpoint', formData)

// Other methods: api.patch(), api.delete()
```
- Base URL: `/v1`
- Automatically includes `credentials: 'same-origin'` to send JWT cookies
- Auto-detects FormData vs JSON and sets appropriate Content-Type
- For FormData: Browser automatically sets `multipart/form-data` with boundary
- For JSON: Sets `Content-Type: application/json` and stringifies body
- Returns parsed JSON response
- Throws errors for non-OK responses

### CSS Structure
- `material-dashboard.css` - Main Material Dashboard theme styles
- `nucleo-icons.css`, `nucleo-svg.css` - Nucleo icon sets
- `custom.css` - Project-specific overrides and SweetAlert2 custom styles
- Page-specific CSS files in `/css/portfolio/`, `/css/company/`, etc.

### CSS Architecture and Responsive Design
- **Desktop-first approach**: Base styles for desktop, media queries for smaller screens
- **Breakpoints**: 1024px (tablet), 768px (mobile), 480px (small mobile)
- **Badge components**: Shared `.status-badge` and `.type-badge` classes with unified styles
- **Z-index hierarchy**: Modals (9999), SweetAlert2 (10000) - alerts always appear above modals
- **Responsive patterns**:
  - Desktop tables → Mobile card layouts (`.modal-cards-container` shown on mobile, `.modal-table-container` hidden)
  - Search areas adapt: horizontal on desktop → vertical on mobile
  - Pagination: flexbox with wrap for mobile, page info moves to separate row

### Modal Patterns
- **Desktop**: Draggable modals (drag by header, but not on close button)
- **Mobile**: Fixed position, dragging disabled (window.innerWidth <= 768)
- **Structure**: `.modal-overlay` → `.modal-container` → `.modal-header` + `.modal-content` + `.modal-footer`
- **Dual rendering**: Both table and card views rendered simultaneously, CSS controls visibility
- **Selection sync**: Table row selection syncs with card selection and vice versa

### Pagination Implementation
- JavaScript-driven pagination (not DataTables)
- Variables: `currentPage`, `pageSize`, `totalPages`, `totalElements`
- API response format: `{ data: { content: [...], totalPages: N, totalElements: M } }`
- UI elements: Previous/Next buttons, page number buttons (showing currentPage ±2), page info display
- Resets to page 0 when: search performed, page size changed, filters modified

## Common Patterns

### Adding New API Endpoints
1. Create DTO in `dto/` package
2. Add controller method in `controller/api/`
3. Implement service logic in `service/`
4. Update SecurityConfig if public endpoint needed
5. Use `ApiResponseDto.makeResponse()` for consistent responses (from common module)

### Working with QueryDSL
```java
// Inject JPAQueryFactory (configured in QueryDSLConfig)
private final JPAQueryFactory queryFactory;

// Use Q-classes from common module
QEntity entity = QEntity.entity;
List<Entity> results = queryFactory
    .selectFrom(entity)
    .where(entity.field.eq(value))
    .fetch();
```

### Adding Menu Items to Sidebar
1. Edit `src/main/resources/templates/fragments/header.html`
2. Add menu item with Material Symbol icon:
   ```html
   <li class="nav-item">
       <a data-bs-toggle="collapse" href="#menuId" class="nav-link text-dark">
           <i class="material-symbols-rounded opacity-5">icon_name</i>
           <span class="nav-link-text ms-1 ps-1">메뉴명</span>
       </a>
   </li>
   ```
3. Use `th:classappend` for dynamic menu activation based on `menuActive` and `subMenuActive`

### Frontend Alert Patterns
```javascript
// Simple alert
san.errorAlert('오류가 발생했습니다.');

// With callback
san.successAlert('저장되었습니다.', function() {
    window.location.href = '/list';
});

// Confirmation
san.confirm('정말 삭제하시겠습니까?',
    function() { /* delete */ },
    function() { /* cancel */ }
);
```

### API Call Patterns
```javascript
// Simple GET
api.get('/auth/user')
    .then(data => console.log(data))
    .catch(error => san.errorAlert(error.message));

// GET with pagination and search
const params = new URLSearchParams({
    page: currentPage,
    size: pageSize,
    keyword: searchKeyword
});
api.get(`/portfolio/main/list?${params.toString()}`)
    .then(response => {
        const data = response.data;
        totalPages = data.totalPages;
        totalElements = data.totalElements;
        renderTable(data.content);
    });

// POST with JSON data
api.post('/auth/login', { id: 'user', password: 'pass' })
    .then(response => {
        san.successAlert('로그인 성공', () => {
            window.location.href = '/dashboard';
        });
    });

// PUT with file upload (multipart/form-data)
const formData = new FormData();
if (logoFile) {
    formData.append('logoFile', logoFile);
}
if (mainFile) {
    formData.append('mainFile', mainFile);
}
const jsonBody = {
    companyNo: companyNo,
    companyName: companyName,
    // ... other fields
};
formData.append('jsonBody', new Blob([JSON.stringify(jsonBody)], { type: 'application/json' }));

api.put('/company', formData)
    .then(data => {
        san.successAlert('저장되었습니다.', () => {
            window.location.reload();
        });
    })
    .catch(error => {
        san.errorAlert('저장 중 오류가 발생했습니다.');
    });
```

### File Upload with Image Preview Pattern
```javascript
// Load existing image from server
function loadImagePreview(imageUrl, previewContainer) {
    if (imageUrl) {
        previewContainer.innerHTML = `<img src="${imageUrl}" alt="Existing Image">`;
        previewContainer.classList.add('active');
        previewContainer.parentElement.querySelector('.file-upload-placeholder').style.display = 'none';
    }
}

// On page load, display existing images
api.get('/company')
    .then(data => {
        if (data && data.data) {
            if (data.data.logoUrl) {
                loadImagePreview(data.data.logoUrl, logoPreview);
            }
            if (data.data.mainImgUrl) {
                loadImagePreview(data.data.mainImgUrl, mainPreview);
            }
        }
    });

// Handle new file selection
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            previewContainer.classList.add('active');
            // Hide placeholder
        };
        reader.readAsDataURL(file);
    }
});
```

### Search + Pagination Pattern
```javascript
// Variables at top of DOMContentLoaded
let currentPage = 0;
let pageSize = 10;
let totalPages = 0;
let totalElements = 0;
let searchKeyword = '';

// Search event handlers
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

function performSearch() {
    searchKeyword = searchInput.value.trim();
    currentPage = 0;  // Always reset to first page
    loadData();
}

// Items per page change
itemsPerPageSelect.addEventListener('change', function() {
    pageSize = parseInt(this.value);
    currentPage = 0;
    loadData();
});

// Pagination rendering
function renderPagination() {
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    // Generate Previous, page numbers, Next buttons
    // Update page info: `${currentPage + 1} / ${totalPages} 페이지`
}
```

### Modal with Dual View (Table/Card) Pattern
```javascript
// Render both table and cards simultaneously
function renderModalTable(portfolios) {
    const tableBody = document.getElementById('modalPortfolioTableBody');
    const cardsContainer = document.getElementById('modalPortfolioCards');

    tableBody.innerHTML = '';
    cardsContainer.innerHTML = '';

    portfolios.forEach(portfolio => {
        // Create table row
        const row = createTableRow(portfolio);
        tableBody.appendChild(row);

        // Create card
        const card = createCard(portfolio);
        cardsContainer.appendChild(card);

        // Sync selections between table and card
        row.addEventListener('click', () => selectModalRow(row, portfolio));
        card.addEventListener('click', () => selectModalCard(card, portfolio));
    });
}

// Selection syncing
function selectModalRow(row, portfolio) {
    // Clear all selections
    document.querySelectorAll('.portfolio-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('#modalPortfolioTableBody tr').forEach(r => r.classList.remove('selected'));

    // Set selection
    row.classList.add('selected');
    document.querySelector(`.portfolio-card-radio[value="${portfolio.portfolioNo}"]`)
        .closest('.portfolio-card').classList.add('selected');

    // Fill form
    fillFormWithPortfolio(portfolio);
}
```

## Working Guidelines

- **Multi-Module Dependency:** Always rebuild common module before admin module when entities change
- **Security:** Public endpoints must be explicitly added to SecurityConfig
- **Timezone:** All date/time operations use Asia/Seoul timezone
- **Profile:** Default profile is 'local' - ensure environment variables are set
- **Icons:** Use Material Symbols Rounded as primary icon system for consistency
- **File Uploads:** Always use api.js with FormData - it handles credentials and Content-Type automatically
- **Image URLs:** Server returns web-accessible paths (`/uploads/...`) not file system paths
- **Inline Styles:** Avoid inline styles in HTML - use CSS classes for all styling, including widths
- **Responsive Design:** Test on desktop (>768px) and mobile (≤768px) - modals behave differently
- **Badge Styling:** Always use shared badge classes (`.status-badge`, `.type-badge`) with consistent `min-height` and `line-height`
