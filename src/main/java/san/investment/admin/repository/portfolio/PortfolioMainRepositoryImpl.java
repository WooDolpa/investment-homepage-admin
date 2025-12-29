package san.investment.admin.repository.portfolio;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import san.investment.common.entity.portfolio.PortfolioMain;

import java.util.List;
import java.util.Optional;

import static san.investment.common.entity.portfolio.QPortfolioMain.portfolioMain;

/**
 * packageName : san.investment.admin.repository.portfolio
 * className : PortfolioMainRepositoryImpl
 * user : jwlee
 * date : 2025. 12. 29.
 * description :
 */
@RequiredArgsConstructor
public class PortfolioMainRepositoryImpl implements PortfolioMainCustomRepository {

    private final JPAQueryFactory factory;

    @Override
    public Optional<List<PortfolioMain>> findPortfolioMainList() {

        List<PortfolioMain> list = factory.select(portfolioMain)
                .from(portfolioMain)
                .innerJoin(portfolioMain.portfolio).fetchJoin()
                .orderBy(portfolioMain.orderNum.asc())
                .fetch();

        return Optional.ofNullable(list);
    }
}
