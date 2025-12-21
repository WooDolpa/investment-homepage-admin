package san.investment.admin.repository.menu;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import san.investment.admin.repository.QuerySpec;
import san.investment.common.entity.menu.Menu;
import san.investment.common.enums.DataStatus;

import java.util.List;

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

    @Override
    public Page<Menu> findMenuPage(Pageable pageable) {

        List<OrderSpecifier> orders = getOrderSpecifiers(pageable, menu);

        List<Menu> list = factory.select(menu)
                .from(menu)
                .where(
                        menu.dataStatus.ne(DataStatus.Delete)
                )
                .orderBy(orders.toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long totalCount = factory.select(menu.count())
                .from(menu)
                .where(
                        menu.dataStatus.ne(DataStatus.Delete)
                )
                .fetchOne();

        return new PageImpl<>(list, pageable, totalCount);
    }
}
