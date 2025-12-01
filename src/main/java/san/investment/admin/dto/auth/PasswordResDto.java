package san.investment.admin.dto.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PasswordResDto {

    private String password;

    @Builder
    public PasswordResDto(String password) {
        this.password = password;
    }
}
