package san.investment.admin.repository.portfolio;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import san.investment.admin.enums.SearchType;
import san.investment.common.entity.portfolio.Portfolio;
import san.investment.common.enums.DataStatus;

/**
 * packageName : san.investment.admin.repository.portfolio
 * className : PortfolioCustomRepository
 * user : jwlee
 * date : 2025. 12. 28.
 * description :
 */
public interface PortfolioCustomRepository {
    Page<Portfolio> findPortfolio(SearchType findSearchType, String keyword, DataStatus findDataStatus, Pageable pageable);
}
