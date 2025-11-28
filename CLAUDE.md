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

 
- 내가 너한테 질문을 하면 너는 질문에대한 해결방안 또는 가이드를 다음 지침에 따라
- 너는 가이드만하고 직접 수정은 금지야