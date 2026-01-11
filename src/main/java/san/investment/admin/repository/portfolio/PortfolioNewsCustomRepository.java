package san.investment.admin.repository.portfolio;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import san.investment.common.entity.portfolio.Portfolio;
import san.investment.common.entity.portfolio.PortfolioNews;

/**
 * packageName : san.investment.admin.repository.portfolio
 * className : PortfolioNewsCustomRepository
 * user : jwlee
 * date : 2026. 1. 7.
 * description :
 */
public interface PortfolioNewsCustomRepository {
    Page<PortfolioNews> findPortfolioNewsList(Pageable pageable, Portfolio portfolio);
}
