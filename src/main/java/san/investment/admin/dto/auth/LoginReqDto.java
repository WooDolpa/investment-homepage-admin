package san.investment.admin.dto.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class LoginReqDto {

    private String id;
    private String password;
}
