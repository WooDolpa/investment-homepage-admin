package san.investment.admin.service.portfolio;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import san.investment.admin.dto.portfolio.PortfolioReqDto;
import san.investment.admin.repository.portfolio.PortfolioRepository;
import san.investment.admin.utils.FileUtil;
import san.investment.common.entity.portfolio.Portfolio;
import san.investment.common.enums.DataStatus;

import java.util.ArrayList;
import java.util.List;

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
}
