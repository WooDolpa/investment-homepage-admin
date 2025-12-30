package san.investment.admin.repository.portfolio;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import san.investment.admin.enums.SearchType;
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
    Page<PortfolioMain> findPortfolioMainPage(SearchType searchType, String keyword, Pageable pageable);
}
