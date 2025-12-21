package san.investment.admin.repository.menu;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import san.investment.common.entity.menu.Menu;

/**
 * packageName : san.investment.admin.repository.menu
 * className : MenuCustomRepository
 * user : jwlee
 * date : 2025. 12. 22.
 * description :
 */
public interface MenuCustomRepository {

    Page<Menu> findMenuPage(Pageable pageable);
}
