package san.investment.admin.repository.menu;

import san.investment.admin.enums.SearchType;
import san.investment.common.entity.menu.Menu;
import san.investment.common.enums.DataStatus;

import java.util.List;
import java.util.Optional;

/**
 * packageName : san.investment.admin.repository.menu
 * className : MenuCustomRepository
 * user : jwlee
 * date : 2025. 12. 22.
 * description :
 */
public interface MenuCustomRepository {

    Optional<List<Menu>> findMenuList(SearchType searchType, String keyword, DataStatus dataStatus);
}
