package san.investment.admin.dto.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RefreshReqDto {

    private String refreshToken;
}
