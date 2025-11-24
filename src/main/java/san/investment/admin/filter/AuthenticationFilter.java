package san.investment.admin.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

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



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("[AuthenticationFilter][doFilterInternal] 여기 지나가나요?");
        filterChain.doFilter(request, response);
    }
}
