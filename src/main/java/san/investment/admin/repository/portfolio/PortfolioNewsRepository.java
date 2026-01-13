package san.investment.admin.repository.portfolio;

import org.springframework.data.jpa.repository.JpaRepository;
import san.investment.common.entity.portfolio.Portfolio;
import san.investment.common.entity.portfolio.PortfolioNews;

import java.util.List;
import java.util.Optional;

/**
 * packageName : san.investment.admin.repository.portfolio
 * className : PortfolioNewsRepository
 * user : jwlee
 * date : 2026. 1. 7.
 * description :
 */
public interface PortfolioNewsRepository extends JpaRepository<PortfolioNews, Integer>, PortfolioNewsCustomRepository {
    Long countByPortfolio(Portfolio portfolio);
    Optional<List<PortfolioNews>> findByOrderNumGreaterThanEqual(Integer orderNum);
}
