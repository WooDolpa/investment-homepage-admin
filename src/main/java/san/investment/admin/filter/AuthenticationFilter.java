package san.investment.admin.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import san.investment.admin.http.CustomHttpServletRequest;
import san.investment.admin.repository.admin.AdminRepository;
import san.investment.admin.security.CustomUserDetailService;
import san.investment.admin.utils.JWTUtil;
import san.investment.common.constants.ApiConstants;
import san.investment.common.exception.CustomException;
import san.investment.common.exception.ExceptionCode;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * packageName : san.investment.admin.filter
 * className : AuthenticationFilter
 * user : jwlee
 * date : 2025. 11. 18.
 * description :
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AuthenticationFilter extends OncePerRequestFilter {

    private final AntPathMatcher antPathMatcher = new AntPathMatcher();
    private final CustomUserDetailService userDetailService;
    private final JWTUtil jwtUtil;
    private final AdminRepository adminRepository;

    // Token 이 필요없는 URL
    private final static List<String> NO_NEED_TOKEN_API = Arrays.asList(
            "/",
            "/login",
            "/v1/auth/login",
            "/v1/auth/logout",
            "/v1/auth/password",
            "/js/**",
            "/css/**",
            "/image/**",
            "/scss/**",
            "/fonts/**",
            "/favicon.ico",
            "/.well-known/**"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        CustomHttpServletRequest customRequest = null;
        try {
            customRequest = new CustomHttpServletRequest(request);
            log.info("[AuthenticationFilter][doFilterInternal] request uri : {}", customRequest.getRequestURI());
        } catch (Exception e) {
            log.error("[AuthenticationFilter][doFilterInternal] filter error : {}", e.getMessage());
            throw new CustomException(ExceptionCode.SERVER_ERROR);
        }

        // 토큰이 필요 없는 API 인 경우 통과
        if(isNoNeedTokenApi(customRequest)) {
            filterChain.doFilter(customRequest, response);
            return;
        }

        String token = resolveAccessToken(request.getCookies());

        // token 유효성 검사
        if(!jwtUtil.validateToken(token)) {
            log.warn("[AuthenticationFilter][doFilterInternal] Invalid Token");
            // SecurityContext 초기화
            SecurityContextHolder.clearContext();
            // cookie 삭제
            Cookie expireCookie = new Cookie("token", null);
            expireCookie.setHttpOnly(true);
            expireCookie.setPath("/");
            expireCookie.setMaxAge(0);
            response.addCookie(expireCookie);

            response.sendRedirect("/login");
            return;
        }

        // 토큰에서 ID 추출
        String loginId = jwtUtil.resolveAdminId(token);
        if(StringUtils.hasText(loginId)) {
            // UserDetails(DB 사용자 인증)
            UserDetails userDetails = userDetailService.loadUserByUsername(loginId);
            // Authentication 객체 생성
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            // SecurityContext 에 인증 정보 설정
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.debug("[AuthenticationFilter][doFilterInternal] 인증 설정 완료 : {}", loginId);

            String adminName = jwtUtil.resolveAdminName(token);

            customRequest.putHeader(ApiConstants.REQUEST_HEADER_ADMIN_ID, loginId);
            customRequest.putHeader(ApiConstants.REQUEST_HEADER_ADMIN_NAME, adminName);
        }

        filterChain.doFilter(customRequest, response);
    }

    /**
     * Token 추출
     *
     * @param cookies
     * @return
     */
    private String resolveAccessToken(Cookie[] cookies) {
        if(cookies == null) return null;
        return Arrays.stream(cookies)
                .filter(cookie -> "token".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    /**
     * 토큰이 필요없는 API인지 비교
     *
     * @param request
     * @return
     */
    private boolean isNoNeedTokenApi(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return NO_NEED_TOKEN_API.stream().anyMatch(tokenApi -> antPathMatcher.match(tokenApi, uri));
    }
}
