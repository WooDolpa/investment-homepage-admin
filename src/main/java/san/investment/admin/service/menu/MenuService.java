package san.investment.admin.service.menu;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import san.investment.admin.dto.menu.MenuResDto;
import san.investment.admin.dto.menu.MenuUpdReqDto;
import san.investment.admin.enums.SearchType;
import san.investment.admin.repository.menu.MenuRepository;
import san.investment.admin.utils.PageableUtil;
import san.investment.common.entity.menu.Menu;
import san.investment.common.enums.DataStatus;
import san.investment.common.exception.CustomException;
import san.investment.common.exception.ExceptionCode;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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

    /**
     * 메뉴 리스트 조회
     *
     * @param searchType
     * @param keyword
     * @param dataStatus
     * @return
     */
    public List<MenuResDto> findMenuList(String searchType, String keyword, String dataStatus) {

        SearchType findSearchType = SearchType.findSearchType(searchType);
        DataStatus findDataStatus = null;
        if(StringUtils.hasText(dataStatus)){
            findDataStatus = DataStatus.findDataStatus(dataStatus);
        }

        List<Menu> menuList = menuRepository.findMenuList(findSearchType, keyword, findDataStatus)
                .orElse(new ArrayList<>());

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

    /**
     * 메뉴 수정
     *
     * @param dto
     */
    @Transactional
    public void updateMenu(MenuUpdReqDto dto) {

        Menu findMenu = menuRepository.findById(dto.getMenuId())
                .orElseThrow(() -> new CustomException(ExceptionCode.MENU_NOT_FOUND));

        Integer originalOrderNum = findMenu.getOrderNum();
        Integer newOrderNum = dto.getOrderNum();

        if(!Objects.equals(originalOrderNum, newOrderNum)) {
            if(originalOrderNum > newOrderNum) {
                List<Menu> list = menuRepository.findByOrderNumGreaterThanEqualAndOrderNumLessThan(newOrderNum, originalOrderNum)
                        .orElse(new ArrayList<>());
                list.forEach(Menu::increaseOrderNum);
            }else {
                List<Menu> list = menuRepository.findByOrderNumGreaterThanAndOrderNumLessThanEqual(originalOrderNum, newOrderNum)
                        .orElse(new ArrayList<>());
                list.forEach(Menu::decreaseOrderNum);
            }
            findMenu.changeOrderNum(newOrderNum);
        }

        findMenu.changeMenuName(dto.getMenuName());
        findMenu.changeDataStatus(DataStatus.findDataStatus(dto.getDataStatus()));
    }
}
