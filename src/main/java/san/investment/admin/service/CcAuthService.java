package san.investment.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import san.investment.admin.repository.auth.CcAuthRepository;
import san.investment.common.entity.auth.CcAuth;
import san.investment.common.exception.CustomException;
import san.investment.common.exception.ExceptionCode;

import java.time.LocalDateTime;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CcAuthService {

    private final CcAuthRepository ccAuthRepository;

    @Transactional
    public void save(Integer adminNo, String refreshToken, LocalDateTime expireDate) {

        CcAuth findCcAuth = ccAuthRepository.findById(adminNo).orElse(null);
        if(findCcAuth != null) {
            // refresh token 갱신
            findCcAuth.changeRefreshToken(refreshToken);
            findCcAuth.changeExpireDate(expireDate);
        }else {
            // 신규
            findCcAuth = CcAuth.builder()
                    .adminNo(adminNo)
                    .refreshToken(refreshToken)
                    .expireDate(expireDate)
                    .build();

            ccAuthRepository.save(findCcAuth);
        }
    }

    /**
     * refresh token 검증
     *
     * @param adminNo
     * @param refreshToken
     */
    public void validateRefreshToken(Integer adminNo, String refreshToken) {

        CcAuth findCcAuth = ccAuthRepository.findById(adminNo).orElse(null);
        if(findCcAuth != null) {
            if(Objects.equals(refreshToken, findCcAuth.getRefreshToken())) {
                // 현재 만료기간안에 유효한지 체크
                if(LocalDateTime.now().isAfter(findCcAuth.getExpireDate())) {
                    throw new CustomException(ExceptionCode.EXPIRE_REFRESH_TOKEN);
                }
            }else {
                log.warn("[CcAuthService][validateRefreshToken] refresh token information mismatch");
                throw new CustomException(ExceptionCode.INVALID_REFRESH_TOKEN);
            }
        }else {
            // 한번도 로그인 한 이력이 없음 (비정상)
            log.error("[CcAuthService][validateRefreshToken] no login history found... {}", refreshToken);
            throw new CustomException(ExceptionCode.INVALID_REFRESH_TOKEN);
        }
    }
}
