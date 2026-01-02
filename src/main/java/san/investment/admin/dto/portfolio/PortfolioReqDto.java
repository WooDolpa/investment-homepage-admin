package san.investment.admin.dto.portfolio;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * packageName : san.investment.admin.dto.portfolio
 * className : PortfolioReqDto
 * user : jwlee
 * date : 2025. 12. 27.
 * description :
 */
@Getter
@NoArgsConstructor
@ToString
public class PortfolioReqDto {

    private String date;
    private String title;
    private String summary;
    private String contents;
    private Integer orderNum;
    private String portfolioType;
}
