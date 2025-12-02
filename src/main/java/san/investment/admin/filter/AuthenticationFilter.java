package san.investment.admin.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
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
import san.investment.admin.security.CustomUserDetailService;
import san.investment.admin.utils.JWTUtil;
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

    // Token 이 필요없는 URL
    private final static List<String> NO_NEED_TOKEN_API = Arrays.asList(
            "/",
            "/login",
            "/v1/auth/login",
            "/v1/auth/password",
            "/js/**",
            "/css/**",
            "/image/**",
            "/scss/**"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 토큰이 필요 없는 API 인 경우 통과
        if(isNoNeedTokenApi(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = resolveAccessToken(request);
        // token 유효성 검사
        if(!jwtUtil.validateToken(token)) {
            log.warn("[AuthenticationFilter][doFilterInternal] Invalid Token");
            throw new CustomException(ExceptionCode.INVALID_TOKEN);
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
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Token 추출
     *
     * @param request
     * @return
     */
    private String resolveAccessToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if(authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            log.warn("[AuthenticationFilter][resolveAccessToken] Authorization 헤더가 없거나 형식이 잘못됨");
            throw new CustomException(ExceptionCode.EXPIRE_TOKEN);
        }
        return authorizationHeader.substring(7);
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
