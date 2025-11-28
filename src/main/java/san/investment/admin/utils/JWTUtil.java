package san.investment.admin.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import san.investment.common.exception.CustomException;
import san.investment.common.exception.ExceptionCode;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Slf4j
@Component
public class JWTUtil {

    private final SecretKey JWT_SECRET_KEY;
    private final long EXPIRATION_TIME = 1_800;        // 30분
    private final long REFRESH_ABSOLUTE_TIME = 1_209_600;

    public JWTUtil(@Value("${jwt.secret-key}")String secretKey) {
        this.JWT_SECRET_KEY = Keys.hmacShaKeyFor(secretKey.getBytes());
        log.info("[JWTUtil] JWT Secret Key 초기화 완료");
    }

    /**
     * Token 생성
     *
     * @param id
     * @return
     */
    public String generateToken(String loginId, Integer id) {

        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(EXPIRATION_TIME);

        return Jwts.builder()
                .subject(loginId)
                .claim("id", id)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(JWT_SECRET_KEY, Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Refresh Token 생성
     *
     * @param id
     * @return
     */
    public String generateRefreshToken(String id) {

        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(REFRESH_ABSOLUTE_TIME);

        return Jwts.builder()
                .subject(id)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(JWT_SECRET_KEY, Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Token 유효성 검사
     *
     * @param token
     * @return
     */
    public boolean validateToken(String token) {
        try {
            Claims claims = resolveClaimsFromToken(token);
            if(claims != null) {
                return !claims.getExpiration().before(new Date());
            }else {
                log.warn("[JWTUtil][validateToken] claims is null");
                return false;
            }
        }catch (Exception e){
            log.error("[JWTUtil][validateToken] error message : {}", e.getMessage());
            return false;
        }
    }

    /**
     * 관리자 번호 추출
     *
     * @param token
     * @return
     */
    public String resolveAdminId(String token) {
        try {
            Claims claims = resolveClaimsFromToken(token);
            if(claims != null) {
                return claims.getSubject();
            }
            log.warn("[JWTUtil][getAdminId] claims is null");
            return null;
        }catch (Exception e){
            log.error("[JWTUtil][getAdminId] error message : {}", e.getMessage());
            return null;
        }
    }

    /**
     * 만료일자 LocalDateTime 으로 변환
     *
     * @param token
     * @return
     */
    public LocalDateTime getExpirationAsLocalDateTime(String token) {
        Date expiration = getExpirationDateFromToken(token);
        if(expiration != null) {
            return expiration.toInstant()
                    .atZone(ZoneId.of("Asia/Seoul"))
                    .toLocalDateTime();
        }
        throw new CustomException(ExceptionCode.SERVER_ERROR);
    }

    /**
     * 만료일자 조회
     *
     * @param token
     * @return
     */
    private Date getExpirationDateFromToken(String token) {
        Claims claims = resolveClaimsFromToken(token);
        if(claims != null) {
            return claims.getExpiration();
        }
        return null;
    }

    /**
     * Claims 추출
     *
     * @param token
     * @return
     */
    private Claims resolveClaimsFromToken(String token) {
        try {
            Jws<Claims> jws = Jwts.parser()
                    .verifyWith(JWT_SECRET_KEY)
                    .build()
                    .parseSignedClaims(token);

            return jws.getPayload();
        }catch (Exception e){
            log.error("[JWTUtil][resolveClaimsFromToken] error message : {}", e.getMessage());
            return null;
        }
    }
}
