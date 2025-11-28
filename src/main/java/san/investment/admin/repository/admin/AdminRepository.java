package san.investment.admin.repository.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import san.investment.common.entity.admin.Admin;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByLoginId(String loginId);
}
