package san.investment.admin.repository.portfolio;

import org.springframework.data.jpa.repository.JpaRepository;
import san.investment.common.entity.portfolio.Portfolio;
import san.investment.common.entity.portfolio.PortfolioMain;

import java.util.List;
import java.util.Optional;

/**
 * packageName : san.investment.admin.repository.portfolio
 * className : PortfolioMainRepository
 * user : jwlee
 * date : 2025. 12. 29.
 * description :
 */
public interface PortfolioMainRepository extends JpaRepository<PortfolioMain, Integer>, PortfolioMainCustomRepository {
    boolean existsByPortfolio(Portfolio portfolio);
    Optional<List<PortfolioMain>> findByOrderNumGreaterThanEqual(Integer orderNum);
    Optional<List<PortfolioMain>> findByOrderNumGreaterThan(Integer orderNum);
}
