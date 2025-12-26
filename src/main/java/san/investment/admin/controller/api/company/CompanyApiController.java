package san.investment.admin.controller.api.company;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import san.investment.admin.dto.company.CompanyUpdDto;
import san.investment.admin.service.company.CompanyService;
import san.investment.common.dto.ApiResponseDto;
import san.investment.common.exception.CustomException;
import san.investment.common.exception.ExceptionCode;

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

    /**
     * 회사 수정
     *
     * @param logoFile
     * @param mainFile
     * @param jsonBody
     * @return
     */
    @PutMapping
    public ResponseEntity<String> updateCompany(@RequestPart(value = "logoFile", required = false) MultipartFile logoFile,
                                                @RequestPart(value = "mainFile", required = false) MultipartFile mainFile,
                                                @RequestPart(value = "jsonBody") String jsonBody) {

        CompanyUpdDto dto = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            dto = mapper.readValue(jsonBody, CompanyUpdDto.class);
        }catch (Exception e) {
            log.error("[CompanyApiController][updateCompany] Json Parser error : {}", e.getMessage());
            throw new CustomException(ExceptionCode.INVALID_PARAMETER);
        }

        log.info("[CompanyApiController][updateCompany] dto: {}", dto);
        companyService.updateCompany(dto, logoFile, mainFile);
        return new ResponseEntity<>(ApiResponseDto.makeSuccessResponse(), HttpStatus.OK);
    }
}
