package san.investment.admin.dto.company;

import lombok.*;

/**
 * packageName : san.investment.admin.dto.company
 * className : CompanyResDto
 * user : jwlee
 * date : 2025. 12. 21.
 * description :
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CompanyResDto {

    private Integer companyNo;
    private String companyName;
    private String logoUrl;
    private String mainImgUrl;
    private String companyInfo;
    private String postCode;
    private String address;
    private String addressDetail;
    private String dataStatus;
    private String dataStatusStr;
}
