package san.investment.admin.controller.api;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import san.investment.admin.dto.auth.LoginReqDto;
import san.investment.admin.dto.auth.LoginResDto;
import san.investment.admin.service.AuthService;
import san.investment.common.dto.ApiResponseDto;

@Slf4j
@RestController
@RequestMapping(path = "/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 로그인
     *
     * @param dto
     * @return
     */
    @PostMapping(path = "/login")
    public ResponseEntity<LoginResDto> login(@RequestBody LoginReqDto dto, HttpServletResponse response) {

        LoginResDto loginResDto = authService.login(dto);
        // 쿠키 저장
        Cookie cookie = new Cookie("token", loginResDto.getAccessToken());
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok()
                .body(loginResDto);
    }

    @PostMapping(path = "/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {

        // 1. SecurityContext 클리어 (현재 인증 정보 제거)
        SecurityContextHolder.clearContext();

        // 2. 쿠키 삭제 (token 쿠키를 만료시킴)
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);  // 0으로 설정하면 즉시 만료
        response.addCookie(cookie);

        return ResponseEntity.ok()
                .body(ApiResponseDto.makeSuccessResponse());
    }

    /**
     * 비밀번호 인코딩 처리 후 값 제공
     *
     * @param password
     * @return
     */
    @GetMapping(path = "/password")
    public ResponseEntity<String> generatePassword(@RequestParam(name = "password") String password) {
        return new ResponseEntity<>(ApiResponseDto.makeResponse(authService.generatePassword(password)), HttpStatus.OK);
    }
}
