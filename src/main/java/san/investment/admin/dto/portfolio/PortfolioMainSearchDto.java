package san.investment.admin.dto.portfolio;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PortfolioMainSearchDto {

    private String searchType;
    private String keyword;
    private Integer page = 0;
    private Integer size = 10;
}
