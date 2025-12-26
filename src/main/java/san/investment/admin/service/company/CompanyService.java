package san.investment.admin.service.company;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import san.investment.admin.constants.AdminConstants;
import san.investment.admin.dto.company.CompanyResDto;
import san.investment.admin.dto.company.CompanyUpdDto;
import san.investment.admin.repository.company.CompanyRepository;
import san.investment.admin.utils.FileUtil;
import san.investment.common.entity.company.Company;
import san.investment.common.enums.DataStatus;
import san.investment.common.exception.CustomException;
import san.investment.common.exception.ExceptionCode;

/**
 * packageName : san.investment.admin.service
 * className : CompanyService
 * user : jwlee
 * date : 2025. 12. 21.
 * description :
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

    @Value("${file.company.url}")
    private String companyUrl;

    private final CompanyRepository companyRepository;
    private final FileUtil fileUtil;

    /**
     * 회사 조회
     *
     * @return
     */
    public CompanyResDto findCompany() {

        Company findCompany = companyRepository.findById(AdminConstants.COMPANY_ID)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_COMPANY));

        DataStatus dataStatus = findCompany.getDataStatus();

        return CompanyResDto.builder()
                .companyNo(findCompany.getCompanyNo())
                .companyName(findCompany.getCompanyName())
                .logoUrl(convertToWebPath(findCompany.getLogoUrl()))
                .mainImgUrl(convertToWebPath(findCompany.getMainImgUrl()))
                .companyInfo(findCompany.getCompanyInfo())
                .postCode(findCompany.getPostCode())
                .address(findCompany.getAddress())
                .addressDetail(findCompany.getAddressDetail())
                .dataStatus(dataStatus.getKey())
                .dataStatusStr(dataStatus.getDesc())
                .build();
    }

    /**
     * Convert absolute file path to web-accessible path
     *
     * @param filePath absolute file path or web path
     * @return web-accessible path
     */
    private String convertToWebPath(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return null;
        }

        // If already a web path, return as is
        if (filePath.startsWith("/uploads/")) {
            return filePath;
        }

        // Convert absolute file path to web path
        // Extract the relative path after the base save directory
        String normalizedPath = filePath.replace("\\", "/");
        int uploadsIndex = normalizedPath.indexOf(companyUrl);

        if (uploadsIndex >= 0) {
            String relativePath = normalizedPath.substring(uploadsIndex);
            return "/uploads/" + relativePath;
        }

        // If path format is unexpected, return original
        log.warn("[CompanyService][convertToWebPath] Unexpected file path format: {}", filePath);
        return filePath;
    }

    /**
     * 회사 수정
     *
     * @param dto
     * @param logoFile
     * @param mainFile
     */
    @Transactional
    public void updateCompany(CompanyUpdDto dto, MultipartFile logoFile, MultipartFile mainFile) {

        Company findCompany = companyRepository.findById(dto.getCompanyNo())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_COMPANY));


        if(logoFile != null && !logoFile.isEmpty()) {
            String subDirectory = companyUrl.concat(String.valueOf(findCompany.getCompanyNo()));
            String logoUrl = fileUtil.saveFile(logoFile, subDirectory);
            findCompany.changeLogoUrl(logoUrl);
        }

        if(mainFile != null && !mainFile.isEmpty()) {
            String subDirectory = companyUrl.concat(String.valueOf(findCompany.getCompanyNo()));
            String mainImgUrl = fileUtil.saveFile(mainFile, subDirectory);
            findCompany.changeMainImgUrl(mainImgUrl);
        }

        findCompany.changeCompanyName(dto.getCompanyName());
        findCompany.changeCompanyInfo(dto.getCompanyInfo());
        findCompany.changePostCode(dto.getPostCode());
        findCompany.changeAddress(dto.getAddress());
        findCompany.changeAddressDetail(dto.getAddressDetail());
    }
}
