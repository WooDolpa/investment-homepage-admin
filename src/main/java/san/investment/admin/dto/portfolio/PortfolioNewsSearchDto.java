package san.investment.admin.dto.portfolio;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName : san.investment.admin.dto.portfolio
 * className : PortfolioNewsSearchDto
 * user : jwlee
 * date : 2026. 1. 7.
 * description :
 */
@Getter
@Setter
@NoArgsConstructor
public class PortfolioNewsSearchDto {

    private Integer page = 0;
    private Integer size = 10;
}
