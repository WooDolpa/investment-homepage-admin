package san.investment.admin.repository.menu;

import org.springframework.data.jpa.repository.JpaRepository;
import san.investment.common.entity.menu.Menu;

import java.util.List;
import java.util.Optional;

/**
 * packageName : san.investment.admin.repository.menu
 * className : MenuRepository
 * user : jwlee
 * date : 2025. 12. 21.
 * description :
 */
public interface MenuRepository extends JpaRepository<Menu, Integer>, MenuCustomRepository {
    Optional<List<Menu>> findByOrderNumGreaterThanEqualAndOrderNumLessThan(Integer newOrderNum, Integer originalOrderNum);
    Optional<List<Menu>> findByOrderNumGreaterThanAndOrderNumLessThanEqual(Integer originalOrderNum, Integer newOrderNum);
}
