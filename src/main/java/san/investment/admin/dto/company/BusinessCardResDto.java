package san.investment.admin.dto.company;

import lombok.*;

/**
 * packageName : san.investment.admin.dto.company
 * className : BusinessCardResDto
 * user : jwlee
 * date : 2026. 2. 8.
 * description :
 */

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BusinessCardResDto {

    private Integer companyNo;
    private String outputUrl;
    private String businessCard1;
    private String businessCard2;
}
