package san.investment.admin.service.company;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import san.investment.admin.constants.AdminConstants;
import san.investment.admin.dto.company.CompanyResDto;
import san.investment.admin.repository.company.CompanyRepository;
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

    private final CompanyRepository companyRepository;

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
                .logoUrl(findCompany.getLogoUrl())
                .mainImgUrl(findCompany.getMainImgUrl())
                .companyInfo(findCompany.getCompanyInfo())
                .postCode(findCompany.getPostCode())
                .address(findCompany.getAddress())
                .addressDetail(findCompany.getAddressDetail())
                .dataStatus(dataStatus.getKey())
                .dataStatusStr(dataStatus.getDesc())
                .build();
    }
}
