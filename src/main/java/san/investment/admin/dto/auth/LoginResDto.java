package san.investment.admin.dto.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginResDto {

    private String accessToken;

    @Builder
    public LoginResDto(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
    }
}
