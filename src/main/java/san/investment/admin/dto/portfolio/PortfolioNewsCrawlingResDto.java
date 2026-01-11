package san.investment.admin.dto.portfolio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName : san.investment.admin.dto.portfolio
 * className : PortfolioNewCrawlingResDto
 * user : jwlee
 * date : 2026. 1. 10.
 * description :
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioNewsCrawlingResDto {

    private String newsTitle;
    private String newsAgency;
    private String newsLink;

}
