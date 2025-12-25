package san.investment.admin.controller.view;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import san.investment.admin.dto.company.CompanyResDto;
import san.investment.admin.service.company.CompanyService;
import san.investment.common.constants.ApiConstants;

@Controller
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping(path = "/company")
    public String company(HttpServletRequest request, Model model) {

        String adminName = request.getHeader(ApiConstants.REQUEST_HEADER_ADMIN_NAME);

        model.addAttribute("adminName", adminName);
        model.addAttribute("menuActive", "company");
        model.addAttribute("subMenuActive", "companyManage");
        return "company/company";
    }

    @GetMapping(path = "/company/update")
    public String companyUpdate(HttpServletRequest request, Model model) {

        String adminName = request.getHeader(ApiConstants.REQUEST_HEADER_ADMIN_NAME);
        CompanyResDto dto = companyService.findCompany();

        model.addAttribute("adminName", adminName);
        model.addAttribute("menuActive", "company");
        model.addAttribute("subMenuActive", "companyManage");
        model.addAttribute("company", dto);

        return "company/company_update";
    }
}
