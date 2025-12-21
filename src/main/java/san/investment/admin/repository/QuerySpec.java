package san.investment.admin.repository;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.Expressions;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;

/**
 * packageName : san.investment.admin.repository
 * className : QuerySpec
 * user : jwlee
 * date : 2025. 12. 22.
 * description :
 */
public class QuerySpec {

    public List<OrderSpecifier> getOrderSpecifiers(Pageable pageable, Path path) {

        List<OrderSpecifier> orderList = new ArrayList<>();
        Sort sort = pageable.getSort();

        if(!sort.isEmpty()) {
            sort.stream().forEach(order -> {
                Order direction = order.getDirection().isAscending() ? Order.ASC : Order.DESC;
                switch (order.getProperty()) {
                    case "createdDate" :
                        orderList.add(getSortedColumn(path, direction, "createdDate"));
                        break;
                    case "orderNum" :
                        orderList.add(getSortedColumn(path, direction, "orderNum"));
                        break;
                    default :
                        break;
                }
            });
        }
        return orderList;
    }

    /**
     * Path 파라미터 -> QueryDSL Q 타입 클래스의 객체
     *
     * @param path
     * @param order
     * @param fieldName
     * @return
     */
    private OrderSpecifier<?> getSortedColumn(Path<?> path, Order order, String fieldName) {
        Path<Object> fieldPath = Expressions.path(path.getType(), path, fieldName);
        return new OrderSpecifier(order, fieldPath);
    }
}
