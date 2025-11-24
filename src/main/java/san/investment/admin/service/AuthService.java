package san.investment.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import san.investment.admin.dto.login.LoginReqDto;
import san.investment.admin.dto.login.PasswordResDto;
import san.investment.admin.repository.AdminRepository;
import san.investment.admin.utils.JWTUtil;
import san.investment.common.entity.Admin;
import san.investment.common.exception.CustomException;
import san.investment.common.exception.ExceptionCode;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;
    private final AdminRepository adminRepository;

    public void login(LoginReqDto dto) {
        // 아이디 검증
        Admin findAdmin = adminRepository.findByLoginId(dto.getId())
                .orElseThrow(() -> new CustomException(ExceptionCode.INVALID_USER_ID));
        // 비밀번호 검증
        // 사용자 인증
        // Token 생성
    }

    /**
     * 비밀번호 인코딩 처리
     *
     * @param password
     * @return
     */
    public PasswordResDto generatePassword(String password) {
        String encodePassword = passwordEncoder.encode(password);
        return PasswordResDto.builder()
                .password(encodePassword)
                .build();
    }
}
