package san.investment.admin.dto.menu;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class MenuUpdReqDto {

    private Integer menuId;
    private String menuName;
    private Integer orderNum;
    private String dataStatus;
}
