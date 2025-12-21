package san.investment.admin.dto.menu;

import lombok.*;

/**
 * packageName : san.investment.admin.dto.menu
 * className : MenuResDto
 * user : jwlee
 * date : 2025. 12. 22.
 * description :
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MenuResDto {

    private Integer menuId;
    private String menuName;
    private Integer orderNum;
    private String dataStatus;
    private String dataStatusStr;
}
