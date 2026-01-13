package san.investment.admin.dto.portfolio;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName : san.investment.admin.dto.portfolio
 * className : PortfolioNewsReqDto
 * user : jwlee
 * date : 2026. 1. 13.
 * description :
 */
@Getter
@NoArgsConstructor
public class PortfolioNewsReqDto {

    private String newsTitle;
    private String newsAgency;
    private String newsLink;
}
