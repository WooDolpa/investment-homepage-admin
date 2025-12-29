package san.investment.admin.repository.portfolio;

import san.investment.common.entity.portfolio.PortfolioMain;

import java.util.List;
import java.util.Optional;

/**
 * packageName : san.investment.admin.repository.portfolio
 * className : PortfolioMainCustomRepository
 * user : jwlee
 * date : 2025. 12. 29.
 * description :
 */
public interface PortfolioMainCustomRepository {
    Optional<List<PortfolioMain>> findPortfolioMainList();
}
