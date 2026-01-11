package san.investment.admin.repository.portfolio;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import san.investment.common.entity.portfolio.Portfolio;
import san.investment.common.entity.portfolio.PortfolioNews;

import java.util.List;

import static san.investment.common.entity.portfolio.QPortfolioNews.portfolioNews;

/**
 * packageName : san.investment.admin.repository.portfolio
 * className : PortfolioNewsRepositoryImpl
 * user : jwlee
 * date : 2026. 1. 7.
 * description :
 */
@RequiredArgsConstructor
public class PortfolioNewsRepositoryImpl implements PortfolioNewsCustomRepository {

    private final JPAQueryFactory factory;

    @Override
    public Page<PortfolioNews> findPortfolioNewsList(Pageable pageable, Portfolio portfolio) {

        List<PortfolioNews> list = factory.select(portfolioNews)
                .from(portfolioNews)
                .where()
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long totalCount = factory.select(portfolioNews.count())
                .from(portfolioNews)
                .where()
                .fetchOne();

        return new PageImpl<>(list, pageable, totalCount != null ? totalCount : 0L);
    }
}
