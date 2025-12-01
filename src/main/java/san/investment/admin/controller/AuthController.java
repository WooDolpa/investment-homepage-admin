package san.investment.admin.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import san.investment.admin.dto.auth.LoginReqDto;
import san.investment.admin.dto.auth.LoginResDto;
import san.investment.admin.dto.auth.RefreshReqDto;
import san.investment.admin.dto.auth.RefreshResDto;
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
    public ResponseEntity<LoginResDto> login(@RequestBody LoginReqDto dto) {
        return ResponseEntity.ok()
                .body(authService.login(dto));
    }

    /**
     * access token 재발급
     *
     * @param dto
     * @return
     */
    @GetMapping(path = "/refresh")
    public ResponseEntity<RefreshResDto> refresh(@RequestBody RefreshReqDto dto) {
        return ResponseEntity.ok()
                .body(authService.refreshAccessToken(dto));
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
