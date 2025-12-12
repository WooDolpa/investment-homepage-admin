package san.investment.admin.controller.view;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CompanyController {

    @GetMapping(path = "/company")
    public String company(HttpServletRequest request, Model model) {

        return "company/company";
    }
}
