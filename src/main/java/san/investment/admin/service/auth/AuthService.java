package san.investment.admin.service.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import san.investment.admin.dto.auth.*;
import san.investment.admin.repository.admin.AdminRepository;
import san.investment.admin.utils.JWTUtil;
import san.investment.common.entity.admin.Admin;
import san.investment.common.exception.CustomException;
import san.investment.common.exception.ExceptionCode;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;
    private final AdminRepository adminRepository;


    /**
     * 로그인
     *
     * @param dto
     * @return
     */
    @Transactional
    public LoginResDto login(LoginReqDto dto) {
        // 아이디 검증
        Admin findAdmin = adminRepository.findByLoginId(dto.getId())
                .orElseThrow(() -> new CustomException(ExceptionCode.INVALID_USER_ID));
        // 비밀번호 검증
        if(!passwordEncoder.matches(dto.getPassword(), findAdmin.getPassword())) {
            throw new CustomException(ExceptionCode.INVALID_PASSWORD);
        }
        // 사용자 인증
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getId(), dto.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authenticate);
        // Token 생성
        String accessToken = jwtUtil.generateToken(findAdmin.getLoginId(), findAdmin.getAdminNo(), findAdmin.getAdminName());

        return LoginResDto.builder()
                .accessToken(accessToken)
                .build();
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
