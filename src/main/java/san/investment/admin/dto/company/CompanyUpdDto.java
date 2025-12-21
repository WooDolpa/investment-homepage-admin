package san.investment.admin.dto.company;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName : san.investment.admin.dto.company
 * className : CompanyUpdDto
 * user : jwlee
 * date : 2025. 12. 21.
 * description :
 */
@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CompanyUpdDto {

    private Integer companyNo;
    private String companyName;
    private String companyInfo;
    private String postCode;
    private String address;
    private String addressDetail;

}
