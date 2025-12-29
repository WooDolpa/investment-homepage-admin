package san.investment.admin.repository.portfolio;

import org.springframework.data.jpa.repository.JpaRepository;
import san.investment.common.entity.portfolio.PortfolioMain;

/**
 * packageName : san.investment.admin.repository.portfolio
 * className : PortfolioMainRepository
 * user : jwlee
 * date : 2025. 12. 29.
 * description :
 */
public interface PortfolioMainRepository extends JpaRepository<PortfolioMain, Integer>, PortfolioMainCustomRepository {
}
