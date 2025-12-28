package san.investment.admin.controller.api.portfolio;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import san.investment.admin.dto.portfolio.PortfolioReqDto;
import san.investment.admin.dto.portfolio.PortfolioSearchDto;
import san.investment.admin.dto.portfolio.PortfolioUpdDto;
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

    /**
     * 포트폴리오 조회
     *
     * @param dto
     * @return
     */
    @GetMapping(path = "/list")
    public ResponseEntity<String> findPortfolioList(@ModelAttribute PortfolioSearchDto dto) {
        return new ResponseEntity<>(ApiResponseDto.makeResponse(portfolioService.findPortfolioList(dto)), HttpStatus.OK);
    }

    /**
     * 포트폴리오 상세 조회
     *
     * @param portfolioNo
     * @return
     */
    @GetMapping(path = "/{portfolioNo}")
    public ResponseEntity<String> findPortfolio(@PathVariable(name = "portfolioNo") Integer portfolioNo) {
        return new ResponseEntity<>(ApiResponseDto.makeResponse(portfolioService.findPortfolio(portfolioNo)), HttpStatus.OK);
    }

    /**
     * 포트폴리오 수정
     *
     * @param file
     * @param jsonBody
     * @return
     */
    @PutMapping
    public ResponseEntity<String> updatePortfolio(@RequestPart(value = "imageFile", required = false) MultipartFile file,
                                                  @RequestPart(value = "jsonBody") String jsonBody) {

        PortfolioUpdDto dto = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            dto = mapper.readValue(jsonBody, PortfolioUpdDto.class);
        }catch (Exception e) {
            log.error("[PortfolioApiController][updatePortfolio] Json Parser error : {}", e.getMessage());
            throw new CustomException(ExceptionCode.INVALID_PARAMETER);
        }

        portfolioService.updatePortfolio(dto, file);
        return new ResponseEntity<>(ApiResponseDto.makeSuccessResponse(), HttpStatus.OK);
    }

    /**
     * 포트폴리오 삭제
     *
     * @param portfolioNo
     * @return
     */
    @DeleteMapping(path = "/{portfolioNo}")
    public ResponseEntity<String> deletePortfolio(@PathVariable(name = "portfolioNo") Integer portfolioNo) {

        portfolioService.deletePortfolio(portfolioNo);
        return new ResponseEntity<>(ApiResponseDto.makeSuccessResponse(), HttpStatus.OK);
    }
}
