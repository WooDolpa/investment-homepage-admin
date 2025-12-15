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
├── controller/      - REST API controllers
├── dto/             - Data Transfer Objects
├── filter/          - Servlet filters (AuthenticationFilter)
├── repository/      - JPA repositories
├── service/         - Business logic services
└── utils/           - Utility classes (JWTUtil)
```

## Architecture Notes

### Multi-Module Structure
- This admin application depends on `investment-homepage-common:1.0` which must be installed in mavenLocal
- Shared entities are located in `san.investment.common.entity` package (from common module)
- Shared components and utilities are in `san.investment.common` package
- `@EntityScan` scans `san.investment.common.entity` for entities
- `@ComponentScan` scans both `san.investment.admin` and `san.investment.common` for Spring components

### Profile-Based Configuration
- Profile is configured in build.gradle (line 58)
- Default profile is 'local'
- Resources are loaded from `src/main/resources/{profile}/`
- Environment variables required:
  - Database: `MARIADB_URL`, `MARIADB_USERNAME`, `MARIADB_PASSWORD`
  - JWT: `JWT_SECRET_KEY` (used for token signing)

### QueryDSL Setup
- Generated Q-classes are placed in `src/main/generated`
- Clean task removes all generated Q-classes (build.gradle line 55)
- JPAQueryFactory is configured in QueryDSLConfig.java

### Security Architecture
- JWT-based authentication (stateless sessions)
- Custom AuthenticationFilter (currently in development - logs but doesn't validate JWT yet)
- Public endpoints: `/js/**`, `/css/**`, `/image/**`, `/scss/**`, `POST /v1/auth/login`, `GET /v1/auth/password`
- All other endpoints require authentication
- CORS configured with wildcard allowedOriginPatterns (needs configuration for production)
- BCrypt password encoding

### JWT Implementation
- Access token expiration: 30 minutes (1,800 seconds)
- Refresh token expiration: 14 days (1,209,600 seconds)
- Secret key loaded from environment variable `JWT_SECRET_KEY`
- Access token contains: loginId (subject), id (claim)
- Refresh token contains: id (subject)
- JWTUtil provides `getExpirationAsLocalDateTime()` to extract expiration from tokens
- **Timezone**: Token expiration dates are converted to "Asia/Seoul" timezone (JWTUtil.java:122)

### Authentication Flow (In Progress)
- Login endpoint at `/v1/auth/login` validates credentials and generates JWT
- Password encoding utility at `/v1/auth/password` (GET endpoint for development)
- AuthenticationFilter is registered but not yet implementing JWT validation
- AuthService.login() method is incomplete (lines 26-33)

## Development Notes

### When Working with Entities
- Entity classes are in the common module (`san.investment.common.entity`)
- Do not create entity classes in this module - they belong in the common module
- After modifying entities in the common module:
  1. Build the common module and install to mavenLocal: `./gradlew publishToMavenLocal`
  2. Rebuild this admin module with QueryDSL Q-classes: `./gradlew clean build`
- For composite primary keys, use either `@IdClass` or `@EmbeddedId` approach

### When Working with Security
- AuthenticationFilter needs JWT validation implementation
- JWTUtil provides token generation and validation utilities
- Remember to update CORS configuration before production deployment (SecurityConfig.java line 56)

### Database
- JPA auditing is enabled (JpaConfig.java)
- Hibernate DDL auto is set to 'none' - database schema is managed manually
- SQL logging is enabled in local profile (includes SQL, bind parameters, and result extraction)
- HikariCP connection pooling configured (min idle 5, idle timeout 60000ms)
- **Important**: Consider configuring database timezone to match application timezone (currently using Asia/Seoul)

## Frontend Architecture

### Template Structure (Thymeleaf)
- Templates located in `src/main/resources/templates/`
- Fragment system for reusable components:
  - `fragments/common.html` - Head section with CSS imports
  - `fragments/header.html` - Sidebar and navbar fragments
  - `fragments/scripts.html` - JavaScript imports
- Main pages: `login/login.html`, `company/company.html`

### JavaScript Organization
```
src/main/resources/static/js/
├── argon-dashboard.js     - Core dashboard functionality (sidebar toggle, dark mode, etc.)
├── common.js              - SweetAlert2 wrapper utilities (san object)
├── api.js                 - API request utilities
├── auth.js                - Authentication helpers
├── common/navbar.js       - Navbar event handlers (logout, etc.)
└── login/login.js         - Login page logic
```

### Frontend Utilities (san object)
Global `san` object in `common.js` provides SweetAlert2-based dialogs:
- `san.warningAlert(message)` - Warning dialog
- `san.errorAlert(message)` - Error dialog
- `san.successAlert(message, callback)` - Success dialog with optional callback
- `san.infoAlert(message)` - Info dialog
- `san.confirm(message, confirmCallback, cancelCallback)` - Confirmation dialog

**Custom styling:** SweetAlert2 uses custom classes defined in `custom.css`:
- `.swal-popup-custom` - Popup container
- `.swal-text-default` - Text content
- `.btn-alert` - Button styling

### CSS Structure
- `argon-dashboard.css` - Main theme styles
- `custom.css` - Project-specific overrides and SweetAlert2 custom styles
- Font Awesome 6.x via CDN (kit: 796886f5b5)

## Authentication & Authorization

### Current Implementation Status
✅ **Completed:**
- Login with JWT generation (POST `/v1/auth/login`)
- Logout with cookie clearing (POST `/v1/auth/logout`)
- Password encoding utility (GET `/v1/auth/password` - dev only)
- Cookie-based token storage (HttpOnly)
- SecurityContext management

⚠️ **In Progress:**
- AuthenticationFilter JWT validation (filter registered but validation not implemented)

### Authentication Flow
1. **Login:**
   - User submits credentials to `/v1/auth/login`
   - AuthService validates against database (BCrypt)
   - JWT generated with 30-minute expiration
   - Token stored in HttpOnly cookie named `token`
   - SecurityContext populated with authentication

2. **Logout:**
   - Client calls `/v1/auth/logout`
   - SecurityContext cleared
   - Token cookie deleted (maxAge=0)
   - **Note:** Token remains valid until expiration (stateless JWT limitation)

3. **Protected Requests:**
   - Token sent via cookie
   - AuthenticationFilter intercepts (validation TODO)
   - JWT validated and claims extracted
   - Request processed if valid

### Public Endpoints
Static resources and auth endpoints are public (SecurityConfig.java):
- `/js/**`, `/css/**`, `/image/**`, `/scss/**`, `/fonts/**`
- `GET /`, `GET /login`, `GET /company`
- `POST /v1/auth/login`, `POST /v1/auth/logout`
- `GET /v1/auth/password` (development only)

## Common Patterns

### Adding New API Endpoints
1. Create DTO in `dto/` package
2. Add controller method in `controller/api/`
3. Implement service logic in `service/`
4. Update SecurityConfig if public endpoint needed
5. Use `ApiResponseDto.makeResponse()` for consistent responses

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

## Working Guidelines

- **Guidance Mode:** Provide solutions and guidance without directly modifying code
- **Multi-Module Dependency:** Always rebuild common module before admin module when entities change
- **Security:** Public endpoints must be explicitly added to SecurityConfig
- **Timezone:** All date/time operations use Asia/Seoul timezone
- **Profile:** Default profile is 'local' - ensure environment variables are set