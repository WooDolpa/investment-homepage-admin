package san.investment.admin.controller.api.menu;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import san.investment.admin.dto.menu.MenuResDto;
import san.investment.admin.service.menu.MenuService;
import san.investment.common.dto.ApiResponseDto;

import java.util.List;

/**
 * packageName : san.investment.admin.controller.api.menu
 * className : MenuApiController
 * user : jwlee
 * date : 2025. 12. 21.
 * description :
 */
@Slf4j
@RestController
@RequestMapping(path = "/v1/menu")
@RequiredArgsConstructor
public class MenuApiController {

    private final MenuService menuService;

    /**
     * 메뉴 리스트 조회
     *
     * @param sort
     * @param direction
     * @param offset
     * @param size
     * @return
     */
    public ResponseEntity<String> findMenuList(@RequestParam(name = "sort", required = false) String sort,
                                               @RequestParam(name = "direction", required = false) String direction,
                                               @RequestParam(name = "offset", required = false) Integer offset,
                                               @RequestParam(name = "size", required = false) Integer size) {

        List<MenuResDto> menuList = menuService.findMenuList(sort, direction, offset, size);
        return new ResponseEntity<>(ApiResponseDto.makeResponse(menuList), HttpStatus.OK);
    }
}
