package san.investment.admin.dto.portfolio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName : san.investment.admin.dto.portfolio
 * className : PortfolioMainResDto
 * user : jwlee
 * date : 2025. 12. 29.
 * description :
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioMainResDto {

    private Integer portfolioMainNo;
    private Integer portfolioNo;
    private String portfolioTitle;
    private Integer orderNum;
}
