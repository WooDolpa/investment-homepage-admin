package san.investment.admin.dto.portfolio;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName : san.investment.admin.dto.portfolio
 * className : PortfolioSearchDto
 * user : jwlee
 * date : 2025. 12. 28.
 * description :
 */
@Getter
@Setter
@NoArgsConstructor
public class PortfolioSearchDto {

    private String searchType;
    private String keyword;
    private String status;
    private Integer page = 0;
    private Integer size = 10;
}
