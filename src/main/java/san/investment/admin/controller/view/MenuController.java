package san.investment.admin.controller.view;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import san.investment.common.constants.ApiConstants;

/**
 * packageName : san.investment.admin.controller.view
 * className : MenuController
 * user : jwlee
 * date : 2025. 12. 25.
 * description :
 */
@Controller
public class MenuController {

    @GetMapping(path = "/menu")
    public String menu(HttpServletRequest request, Model model) {

        String adminName = request.getHeader(ApiConstants.REQUEST_HEADER_ADMIN_NAME);

        model.addAttribute("adminName", adminName);
        model.addAttribute("menuActive", "menu");
        model.addAttribute("subMenuActive", "menuManage");

        return "menu/menu";
    }
}
