package san.investment.admin.dto.portfolio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName : san.investment.admin.dto.portfolio
 * className : PortfolioResDto
 * user : jwlee
 * date : 2025. 12. 28.
 * description :
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioResDto {

    private Integer portfolioNo;
    private String title;
    private String summary;
    private String contents;
    private String imageUrl;
    private String status;
    private String statusStr;
    private Integer orderNum;

    private Integer totalPages;
    private Long totalElements;
    private Integer currentPage;
    private Integer pageSize;
}
