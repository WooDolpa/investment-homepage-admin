package san.investment.admin.controller.api.menu;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import san.investment.admin.dto.menu.MenuResDto;
import san.investment.admin.dto.menu.MenuUpdReqDto;
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
     * @return
     */
    @GetMapping(path = "/list")
    public ResponseEntity<String> findMenuList(@RequestParam(name = "searchType", required = false) String searchType,
                                               @RequestParam(name = "keyword", required = false) String keyword,
                                               @RequestParam(name = "dataStatus", required = false) String dataStatus) {

        List<MenuResDto> menuList = menuService.findMenuList(searchType, keyword, dataStatus);
        return new ResponseEntity<>(ApiResponseDto.makeResponse(menuList), HttpStatus.OK);
    }

    /**
     * 메뉴 수정
     *
     * @param dto
     * @return
     */
    @PutMapping
    public ResponseEntity<String> updateMenu(@RequestBody MenuUpdReqDto dto) {
        menuService.updateMenu(dto);
        return new ResponseEntity<>(ApiResponseDto.makeSuccessResponse(), HttpStatus.OK);
    }
}
