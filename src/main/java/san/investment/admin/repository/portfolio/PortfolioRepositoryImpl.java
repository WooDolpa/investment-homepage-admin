package san.investment.admin.repository.portfolio;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;
import san.investment.admin.enums.SearchType;
import san.investment.common.entity.portfolio.Portfolio;
import san.investment.common.enums.DataStatus;

import java.util.List;

import static san.investment.common.entity.portfolio.QPortfolio.portfolio;

/**
 * packageName : san.investment.admin.repository.portfolio
 * className : PortfolioRepositoryImpl
 * user : jwlee
 * date : 2025. 12. 28.
 * description :
 */
@RequiredArgsConstructor
public class PortfolioRepositoryImpl implements PortfolioCustomRepository {

    private final JPAQueryFactory factory;

    /**
     *  포트폴리오 조회
     *
     * @param findSearchType
     * @param keyword
     * @param findDataStatus
     * @param pageable
     * @return
     */
    @Override
    public Page<Portfolio> findPortfolio(SearchType findSearchType, String keyword, DataStatus findDataStatus, Pageable pageable) {

        List<Portfolio> list = factory.select(portfolio)
                .from(portfolio)
                .where(
                        portfolio.dataStatus.ne(DataStatus.Delete),
                        findSearch(findSearchType, keyword),
                        findDataStatus(findDataStatus)
                )
                .orderBy(portfolio.orderNum.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long totalCount = factory.select(portfolio.count())
                .from(portfolio)
                .where(
                        portfolio.dataStatus.ne(DataStatus.Delete),
                        findSearch(findSearchType, keyword),
                        findDataStatus(findDataStatus)
                )
                .fetchOne();

        return new PageImpl<>(list, pageable, totalCount != null ? totalCount : 0L);
    }

    /**
     * 검색조건, 검색어
     *
     * @param searchType
     * @param keyword
     * @return
     */
    private BooleanExpression findSearch(SearchType searchType, String keyword) {
        if(StringUtils.hasText(keyword)) {
            if(SearchType.PORTFOLIO_TITLE.equals(searchType)) {
                return portfolio.portfolioTitle.like("%"+keyword+"%");
            }
        }
        return null;
    }

    /**
     * 데이터 상태 조건
     *
     * @param dataStatus
     * @return
     */
    private BooleanExpression findDataStatus(DataStatus dataStatus) {
        if(dataStatus != null) {
            return portfolio.dataStatus.eq(dataStatus);
        }
        return null;
    }
}
