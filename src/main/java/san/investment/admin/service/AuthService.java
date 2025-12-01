package san.investment.admin.service;

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

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;
    private final CcAuthService ccAuthService;
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
        String accessToken = jwtUtil.generateToken(findAdmin.getLoginId(), findAdmin.getAdminNo());
        String refreshToken = jwtUtil.generateRefreshToken(findAdmin.getLoginId(), findAdmin.getAdminNo());

        // refresh 갱신
        Integer adminNo = findAdmin.getAdminNo();
        LocalDateTime expireDate = jwtUtil.getExpirationAsLocalDateTime(refreshToken);

        ccAuthService.save(adminNo, refreshToken, expireDate);

        return LoginResDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * access token 재발급
     *
     * @param dto
     * @return
     */
    @Transactional
    public RefreshResDto refreshAccessToken(RefreshReqDto dto) {

        // 1. Refresh Token 검증
        if(!jwtUtil.validateToken(dto.getRefreshToken())) {
            // 유효하지 않으면 401 에러 발생
            throw new CustomException(ExceptionCode.INVALID_REFRESH_TOKEN);
        }
        // 2. 사용자 번호 추출
        Integer adminNo = jwtUtil.resolveAdminNo(dto.getRefreshToken());
        // 3. 사용자 정보 조회
        Admin admin = adminRepository.findById(adminNo).orElseThrow(() -> new CustomException(ExceptionCode.INVALID_USER_ID));
        // 3. 토큰 존재 여부 및 만료 확인
        ccAuthService.validateRefreshToken(adminNo, dto.getRefreshToken());
        // 5. 새로운 Access Token 발급
        String accessToken = jwtUtil.generateToken(admin.getLoginId(), admin.getAdminNo());

        // 6. 응답 DTO 생성 및 반환
        return RefreshResDto.builder()
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
