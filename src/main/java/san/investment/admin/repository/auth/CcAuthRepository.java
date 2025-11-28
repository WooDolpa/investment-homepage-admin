package san.investment.admin.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import san.investment.common.entity.auth.CcAuth;

public interface CcAuthRepository extends JpaRepository<CcAuth, Integer> {
}
