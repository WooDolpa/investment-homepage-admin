package san.investment.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import san.investment.admin.repository.auth.CcAuthRepository;
import san.investment.common.entity.auth.CcAuth;

import java.time.LocalDateTime;

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
}
