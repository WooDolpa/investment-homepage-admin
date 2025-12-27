package san.investment.admin.controller.api.portfolio;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import san.investment.admin.dto.portfolio.PortfolioReqDto;
import san.investment.admin.service.portfolio.PortfolioService;
import san.investment.common.dto.ApiResponseDto;
import san.investment.common.exception.CustomException;
import san.investment.common.exception.ExceptionCode;

/**
 * packageName : san.investment.admin.controller.api.portfolio
 * className : PortfolioApiController
 * user : jwlee
 * date : 2025. 12. 27.
 * description :
 */
@Slf4j
@RestController
@RequestMapping(path = "/v1/portfolio")
@RequiredArgsConstructor
public class PortfolioApiController {

    private final PortfolioService portfolioService;

    /**
     * 포트폴리오 등록
     *
     * @param file
     * @param jsonBody
     * @return
     */
    @PostMapping
    public ResponseEntity<String> addPortfolio(@RequestPart(value = "imageFile", required = false) MultipartFile file,
                                               @RequestPart(value = "jsonBody") String jsonBody) {

        PortfolioReqDto dto = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            dto = mapper.readValue(jsonBody, PortfolioReqDto.class);
        }catch (Exception e) {
            log.error("[PortfolioApiController][addPortfolio] Json Parser error : {}", e.getMessage());
            throw new CustomException(ExceptionCode.INVALID_PARAMETER);
        }

        portfolioService.addPortfolio(dto, file);
        return new ResponseEntity<>(ApiResponseDto.makeSuccessResponse(), HttpStatus.OK);
    }
}
