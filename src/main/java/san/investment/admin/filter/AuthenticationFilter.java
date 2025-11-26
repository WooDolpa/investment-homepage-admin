package san.investment.admin.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
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
    private final JWTUtil jwtUtil;

    // Token 이 필요없는 URL
    private final static List<String> NO_NEED_TOKEN_API = Arrays.asList(
            "/v1/auth/login",
            "/v1/auth/password",
            "/js/**",
            "/css/**",
            "/image/**",
            "/scss/**",
            "/api/file/**"
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
