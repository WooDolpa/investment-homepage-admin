package san.investment.admin.service.menu;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import san.investment.admin.dto.menu.MenuResDto;
import san.investment.admin.repository.menu.MenuRepository;
import san.investment.admin.utils.PageableUtil;
import san.investment.common.entity.menu.Menu;

import java.util.List;

/**
 * packageName : san.investment.admin.service.menu
 * className : MenuService
 * user : jwlee
 * date : 2025. 12. 22.
 * description :
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {

    private final MenuRepository menuRepository;

    public List<MenuResDto> findMenuList(String sort, String direction, Integer offset, Integer size) {

        int page = (offset / size);
        Pageable pageable = PageableUtil.createPageable(sort, direction, page, size);
        Page<Menu> menuPage = menuRepository.findMenuPage(pageable);

        List<Menu> menuList = menuPage.getContent();
        return menuList.stream()
                .map(menu -> {
                    return MenuResDto.builder()
                            .menuId(menu.getMenuId())
                            .menuName(menu.getMenuName())
                            .orderNum(menu.getOrderNum())
                            .dataStatus(menu.getDataStatus().getKey())
                            .dataStatusStr(menu.getDataStatus().getDesc())
                            .build();
                })
                .toList();
    }
}
