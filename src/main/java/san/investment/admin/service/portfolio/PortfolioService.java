package san.investment.admin.service.portfolio;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import san.investment.admin.dto.portfolio.PortfolioReqDto;
import san.investment.admin.dto.portfolio.PortfolioResDto;
import san.investment.admin.dto.portfolio.PortfolioSearchDto;
import san.investment.admin.dto.portfolio.PortfolioUpdDto;
import san.investment.admin.enums.SearchType;
import san.investment.admin.repository.portfolio.PortfolioRepository;
import san.investment.admin.utils.FileUtil;
import san.investment.common.entity.portfolio.Portfolio;
import san.investment.common.enums.DataStatus;
import san.investment.common.exception.CustomException;
import san.investment.common.exception.ExceptionCode;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * packageName : san.investment.admin.service.portfolio
 * className : PortfolioService
 * user : jwlee
 * date : 2025. 12. 27.
 * description :
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PortfolioService {

    @Value("${file.portfolio.url}")
    private String portfolioUrl;

    private final PortfolioRepository portfolioRepository;
    private final FileUtil fileUtil;

    /**
     * 포트폴리오 등록
     *
     * @param dto
     * @param file
     */
    @Transactional
    public void addPortfolio(PortfolioReqDto dto, MultipartFile file) {

        // 순번
        int totalCount = portfolioRepository.countByDataStatusNot(DataStatus.Delete).intValue();
        Integer orderNum = dto.getOrderNum();
        if(orderNum >= totalCount) {
            orderNum = (totalCount + 1);
        }else {
            List<Portfolio> sortingList = portfolioRepository.findByDataStatusNotAndOrderNumGreaterThanEqual(DataStatus.Delete, orderNum)
                    .orElse(new ArrayList<>());

            sortingList.forEach(Portfolio::increaseOrderNum);
        }

        Portfolio portfolio = Portfolio.builder()
                .portfolioTitle(dto.getTitle())
                .portfolioSummary(dto.getSummary())
                .portfolioContents(dto.getContents())
                .orderNum(orderNum)
                .dataStatus(DataStatus.Yes)
                .build();

        portfolioRepository.save(portfolio);
        if(file != null && !file.isEmpty()) {
            if(portfolio.getPortfolioNo() > 0) {
                String subDirectory = portfolioUrl.concat(String.valueOf(portfolio.getPortfolioNo()));
                String portfolioImgUrl = fileUtil.saveFile(file, subDirectory);
                portfolio.addPortfolioImgUrl(portfolioImgUrl);
            }
        }
    }

    /**
     * 포트폴리오 조회
     *
     * @param dto
     * @return
     */
    public Page<PortfolioResDto> findPortfolioList(PortfolioSearchDto dto) {

        Pageable pageable = PageRequest.of(dto.getPage(), dto.getSize());
        SearchType findSearchType = SearchType.findSearchType(dto.getSearchType());
        DataStatus findDataStatus = null;
        if(StringUtils.hasText(dto.getStatus())) {
            findDataStatus = DataStatus.findDataStatus(dto.getStatus());
        }

        Page<Portfolio> portfolioPage = portfolioRepository.findPortfolio(findSearchType, dto.getKeyword(), findDataStatus, pageable);

        return portfolioPage.map(portfolio -> PortfolioResDto.builder()
                .portfolioNo(portfolio.getPortfolioNo())
                .title(portfolio.getPortfolioTitle())
                .summary(portfolio.getPortfolioSummary())
                .imageUrl(fileUtil.convertToWebPath(portfolio.getPortfolioImgUrl()))
                .status(portfolio.getDataStatus().getKey())
                .statusStr(portfolio.getDataStatus().getDesc())
                .orderNum(portfolio.getOrderNum())
                .totalPages(portfolioPage.getTotalPages())
                .totalElements(portfolioPage.getTotalElements())
                .currentPage(portfolioPage.getNumber())
                .pageSize(portfolioPage.getSize())
                .build());
    }

    /**
     * 포트폴리오 상세 조회
     *
     * @param portfolioNo
     * @return
     */
    public PortfolioResDto findPortfolio(Integer portfolioNo) {

        Portfolio findPortfolio = portfolioRepository.findById(portfolioNo)
                .orElseThrow(() -> new CustomException(ExceptionCode.PORTFOLIO_NOT_FOUND));


        return PortfolioResDto.builder()
                .portfolioNo(findPortfolio.getPortfolioNo())
                .title(findPortfolio.getPortfolioTitle())
                .summary(findPortfolio.getPortfolioSummary())
                .imageUrl(fileUtil.convertToWebPath(findPortfolio.getPortfolioImgUrl()))
                .contents(findPortfolio.getPortfolioContents())
                .status(findPortfolio.getDataStatus().getKey())
                .statusStr(findPortfolio.getDataStatus().getDesc())
                .orderNum(findPortfolio.getOrderNum())
                .build();
    }

    /**
     * 포트폴리오 수정
     *
     * @param dto
     * @param file
     */
    @Transactional
    public void updatePortfolio(PortfolioUpdDto dto, MultipartFile file) {

        Portfolio findPortfolio = portfolioRepository.findById(dto.getPortfolioNo())
                .orElseThrow(() -> new CustomException(ExceptionCode.PORTFOLIO_NOT_FOUND));

        Integer originalOrderNum = findPortfolio.getOrderNum();
        Integer newOrderNum = dto.getOrderNum();

        if(!Objects.equals(originalOrderNum, newOrderNum)) {
            if(originalOrderNum > newOrderNum) {
                List<Portfolio> list = portfolioRepository.findByDataStatusNotAndOrderNumGreaterThanEqualAndOrderNumLessThan(DataStatus.Delete, newOrderNum, originalOrderNum)
                        .orElse(new ArrayList<>());
                list.forEach(Portfolio::increaseOrderNum);
            }else {
                List<Portfolio> list = portfolioRepository.findByDataStatusNotAndOrderNumGreaterThanAndOrderNumLessThanEqual(DataStatus.Delete, originalOrderNum, newOrderNum)
                        .orElse(new ArrayList<>());
                list.forEach(Portfolio::decreaseOrderNum);
            }
        }

        DataStatus dataStatus = DataStatus.findDataStatus(dto.getDataStatus());

        if(file != null && !file.isEmpty()) {
            String subDirectory = portfolioUrl.concat(String.valueOf(findPortfolio.getPortfolioNo()));
            String portfolioImgUrl = fileUtil.saveFile(file, subDirectory);
            findPortfolio.changePortfolioImgUrl(portfolioImgUrl);
        }

        findPortfolio.changePortfolioTitle(dto.getTitle());
        findPortfolio.changePortfolioSummary(dto.getSummary());
        findPortfolio.changePortfolioContents(dto.getContents());
        findPortfolio.changeOrderNum(newOrderNum);
        findPortfolio.changeDataStatus(dataStatus);
    }

    /**
     * 포트폴리오 삭제
     *
     * @param portfolioNo
     */
    @Transactional
    public void deletePortfolio(Integer portfolioNo) {

        Portfolio findPortfolio = portfolioRepository.findById(portfolioNo)
                .orElseThrow(() -> new CustomException(ExceptionCode.PORTFOLIO_NOT_FOUND));

        List<Portfolio> list = portfolioRepository.findByDataStatusNotAndOrderNumGreaterThan(DataStatus.Delete, findPortfolio.getOrderNum())
                .orElse(new ArrayList<>());

        list.forEach(Portfolio::decreaseOrderNum);

        findPortfolio.deleteOrderNum(0);
        findPortfolio.changeDataStatus(DataStatus.Delete);
    }
}
