package san.investment.admin.dto.portfolio;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * packageName : san.investment.admin.dto.portfolio
 * className : PortfolioUpdDto
 * user : jwlee
 * date : 2025. 12. 28.
 * description :
 */
@Getter
@NoArgsConstructor
@ToString
public class PortfolioUpdDto {

    private Integer portfolioNo;
    private String title;
    private String summary;
    private String contents;
    private Integer orderNum;
    private String dataStatus;
    private String portfolioType;
}
