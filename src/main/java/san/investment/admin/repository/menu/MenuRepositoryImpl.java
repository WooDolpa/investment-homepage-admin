package san.investment.admin.repository.menu;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import san.investment.admin.enums.SearchType;
import san.investment.admin.repository.QuerySpec;
import san.investment.common.entity.menu.Menu;
import san.investment.common.enums.DataStatus;

import java.util.List;
import java.util.Optional;

import static san.investment.common.entity.menu.QMenu.menu;

/**
 * packageName : san.investment.admin.repository.menu
 * className : MenuRepositoryImpl
 * user : jwlee
 * date : 2025. 12. 22.
 * description :
 */
@RequiredArgsConstructor
public class MenuRepositoryImpl extends QuerySpec implements MenuCustomRepository {

    private final JPAQueryFactory factory;

    /**
     * 메뉴 조회
     *
     * @param searchType
     * @param keyword
     * @param dataStatus
     * @return
     */
    @Override
    public Optional<List<Menu>> findMenuList(SearchType searchType, String keyword, DataStatus dataStatus) {

        List<Menu> list = factory.select(menu)
                .from(menu)
                .where(
                        menu.dataStatus.ne(DataStatus.Delete),
                        findSearch(searchType, keyword),
                        findDataStatus(dataStatus)
                )
                .orderBy(menu.orderNum.asc())
                .fetch();

        return Optional.ofNullable(list);
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
            if(SearchType.MENU_NAME.equals(searchType)) {
                return menu.menuName.like("%"+keyword+"%");
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
            return menu.dataStatus.eq(dataStatus);
        }
        return null;
    }
}
