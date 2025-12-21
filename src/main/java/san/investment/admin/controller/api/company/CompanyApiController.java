package san.investment.admin.controller.api.company;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import san.investment.admin.service.company.CompanyService;
import san.investment.common.dto.ApiResponseDto;

/**
 * packageName : san.investment.admin.controller.api
 * className : CompanyController
 * user : jwlee
 * date : 2025. 12. 21.
 * description :
 */
@Slf4j
@RestController
@RequestMapping(path = "/v1/company")
@RequiredArgsConstructor
public class CompanyApiController {

    private final CompanyService companyService;

    /**
     * 회사 조회
     *
     * @return
     */
    @GetMapping
    public ResponseEntity<String> findCompany() {
        return new ResponseEntity<>(ApiResponseDto.makeResponse(companyService.findCompany()), HttpStatus.OK);
    }
}
