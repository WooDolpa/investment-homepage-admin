package san.investment.admin.repository.menu;

import org.springframework.data.jpa.repository.JpaRepository;
import san.investment.common.entity.menu.Menu;

/**
 * packageName : san.investment.admin.repository.menu
 * className : MenuRepository
 * user : jwlee
 * date : 2025. 12. 21.
 * description :
 */
public interface MenuRepository extends JpaRepository<Menu, Integer>, MenuCustomRepository {
}
