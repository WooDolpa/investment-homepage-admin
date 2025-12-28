package san.investment.admin.repository.portfolio;

import org.springframework.data.jpa.repository.JpaRepository;
import san.investment.common.entity.portfolio.Portfolio;
import san.investment.common.enums.DataStatus;

import java.util.List;
import java.util.Optional;

/**
 * packageName : san.investment.admin.repository.portfolio
 * className : PortfolioRepository
 * user : jwlee
 * date : 2025. 12. 27.
 * description :
 */
public interface PortfolioRepository extends JpaRepository<Portfolio, Integer>, PortfolioCustomRepository {
    Long countByDataStatusNot(DataStatus dataStatus);
    Optional<List<Portfolio>> findByDataStatusNotAndOrderNumGreaterThanEqual(DataStatus dataStatus, Integer orderNum);
    Optional<List<Portfolio>> findByDataStatusNotAndOrderNumGreaterThanEqualAndOrderNumLessThan(DataStatus dataStatus, Integer newOrderNum, Integer originalOrderNum);
    Optional<List<Portfolio>> findByDataStatusNotAndOrderNumGreaterThanAndOrderNumLessThanEqual(DataStatus dataStatus, Integer originalOrderNum, Integer newOrderNum);
}
