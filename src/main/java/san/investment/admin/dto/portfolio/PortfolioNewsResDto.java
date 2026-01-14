package san.investment.admin.dto.portfolio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName : san.investment.admin.dto.portfolio
 * className : PortfolioNewsResDto
 * user : jwlee
 * date : 2026. 1. 7.
 * description :
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioNewsResDto {

    private Integer portfolioNewsNo;
    private String newsTitle;
    private String newsAgency;
    private String newsLink;
    private Integer orderNum;
    private String dataStatus;
    private String dataStatusStr;

    private Integer totalPages;
    private Long totalElements;
    private Integer currentPage;
    private Integer pageSize;
}
