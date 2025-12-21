package san.investment.admin.repository.company;

import org.springframework.data.jpa.repository.JpaRepository;
import san.investment.common.entity.company.Company;

/**
 * packageName : san.investment.admin.repository.company
 * className : CompanyRepository
 * user : jwlee
 * date : 2025. 12. 21.
 * description :
 */
public interface CompanyRepository extends JpaRepository<Company, Integer> {
}
