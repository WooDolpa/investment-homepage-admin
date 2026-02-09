package san.investment.admin.service.company;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import san.investment.admin.constants.AdminConstants;
import san.investment.admin.dto.company.BusinessCardResDto;
import san.investment.admin.dto.company.BusinessCardUpdDto;
import san.investment.admin.dto.company.CompanyResDto;
import san.investment.admin.dto.company.CompanyUpdDto;
import san.investment.admin.repository.company.CompanyRepository;
import san.investment.admin.utils.FileUtil;
import san.investment.common.entity.company.Company;
import san.investment.common.enums.DataStatus;
import san.investment.common.exception.CustomException;
import san.investment.common.exception.ExceptionCode;

import java.util.Base64;

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

    private final CompanyRepository companyRepository;
    private final FileUtil fileUtil;

    @Value("${file.company.url}")
    private String companyUrl;
    @Value("${company.output.url}")
    private String outputUrl;

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
                .logoUrl(fileUtil.convertToWebPath(findCompany.getLogoUrl()))
                .mainImgUrl(fileUtil.convertToWebPath(findCompany.getMainImgUrl()))
                .companyInfo(findCompany.getCompanyInfo())
                .postCode(findCompany.getPostCode())
                .address(findCompany.getAddress())
                .addressDetail(findCompany.getAddressDetail())
                .dataStatus(dataStatus.getKey())
                .dataStatusStr(dataStatus.getDesc())
                .build();
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

    /**
     * 명함관련 정보
     *
     * @return
     */
    public BusinessCardResDto findBusinessCard() {

        Company findCompany = companyRepository.findById(AdminConstants.COMPANY_ID)
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_COMPANY));

        return BusinessCardResDto.builder()
                .companyNo(findCompany.getCompanyNo())
                .outputUrl(generateOutputUrl(findCompany.getCompanyNo()))
                .businessCard1(fileUtil.convertToWebPath(findCompany.getBusinessCard1()))
                .businessCard2(fileUtil.convertToWebPath(findCompany.getBusinessCard2()))
                .build();
    }

    /**
     * 명함 이미지 업데이트
     *
     * @param dto
     * @param businessCard1File
     * @param businessCard2File
     */
    @Transactional
    public void updateBusinessCard(BusinessCardUpdDto dto, MultipartFile businessCard1File, MultipartFile businessCard2File) {

        Company findCompany = companyRepository.findById(dto.getCompanyNo())
                .orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_COMPANY));

        if(businessCard1File != null && !businessCard1File.isEmpty()) {
            String subDirectory = companyUrl.concat(String.valueOf(findCompany.getCompanyNo()));
            String businessCard1FilePath = fileUtil.saveFile(businessCard1File, subDirectory);
            findCompany.changeBusinessCard1(businessCard1FilePath);
        }

        if(businessCard2File != null && !businessCard2File.isEmpty()) {
            String subDirectory = companyUrl.concat(String.valueOf(findCompany.getCompanyNo()));
            String businessCard2FilePath = fileUtil.saveFile(businessCard2File, subDirectory);
            findCompany.changeBusinessCard2(businessCard2FilePath);
        }
    }

    /**
     * 외부 URL 생성
     *
     * @param id
     * @return
     */
    public String generateUrl(Integer id) {

        companyRepository.findById(id).orElseThrow(() -> new CustomException(ExceptionCode.NOT_FOUND_COMPANY));
        return generateOutputUrl(id);
    }

    private String generateOutputUrl(Integer id) {
        return outputUrl +
                "?id=" +
                encodeToString(String.valueOf(id));
    }

    private String encodeToString(String str) {
        return Base64.getEncoder().encodeToString(str.getBytes());
    }
}
