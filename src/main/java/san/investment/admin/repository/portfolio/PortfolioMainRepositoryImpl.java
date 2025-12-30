package san.investment.admin.repository.portfolio;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;
import san.investment.admin.enums.SearchType;
import san.investment.common.entity.portfolio.PortfolioMain;

import java.util.List;

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
    public Page<PortfolioMain> findPortfolioMainPage(SearchType searchType, String keyword, Pageable pageable) {

        List<PortfolioMain> list = factory.select(portfolioMain)
                .from(portfolioMain)
                .innerJoin(portfolioMain.portfolio).fetchJoin()
                .where(
                        matchSearchType(searchType, keyword)
                )
                .orderBy(portfolioMain.orderNum.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long totalCount = factory.select(portfolioMain.count())
                .from(portfolioMain)
                .innerJoin(portfolioMain.portfolio).fetchJoin()
                .where(
                        matchSearchType(searchType, keyword)
                )
                .fetchOne();

        return new PageImpl<>(list, pageable, totalCount != null ? totalCount : 0L);
    }

    /**
     * 검색조건 검색
     *
     * @param searchType
     * @param keyword
     * @return
     */
    private BooleanExpression matchSearchType(SearchType searchType, String keyword) {
        if(StringUtils.hasText(keyword)) {
            if(searchType != null) {
                if(SearchType.PORTFOLIO_TITLE.equals(searchType)) {
                    return portfolioMain.portfolio.portfolioTitle.like("%" + keyword + "%");
                }
            }
        }
        return null;
    }
}
