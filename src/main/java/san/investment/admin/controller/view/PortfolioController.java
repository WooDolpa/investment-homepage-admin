package san.investment.admin.controller.view;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import san.investment.common.constants.ApiConstants;

@Controller
public class PortfolioController {

    @GetMapping(path = "/portfolio")
    public String portfolio(HttpServletRequest request, Model model) {

        String adminName = request.getHeader(ApiConstants.REQUEST_HEADER_ADMIN_NAME);

        model.addAttribute("adminName", adminName);
        model.addAttribute("menuActive", "portfolio");
        model.addAttribute("subMenuActive", "portfolioManage");

        return "portfolio/portfolio_list";
    }

    @GetMapping(path = "/portfolio/register")
    public String portfolioRegister(HttpServletRequest request, Model model) {

        String adminName = request.getHeader(ApiConstants.REQUEST_HEADER_ADMIN_NAME);

        model.addAttribute("adminName", adminName);
        model.addAttribute("menuActive", "portfolio");
        model.addAttribute("subMenuActive", "portfolioManage");

        return "portfolio/portfolio_register";
    }

    @GetMapping(path = "/portfolio/update")
    public String portfolioUpdate(HttpServletRequest request, Model model) {

        String adminName = request.getHeader(ApiConstants.REQUEST_HEADER_ADMIN_NAME);

        model.addAttribute("adminName", adminName);
        model.addAttribute("menuActive", "portfolio");
        model.addAttribute("subMenuActive", "portfolioManage");

        return "portfolio/portfolio_update";
    }

}
