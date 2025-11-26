package san.investment.admin.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import san.investment.admin.repository.AdminRepository;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        return adminRepository.findByLoginId(id)
                .map(admin -> User.builder()
                        .username(admin.getLoginId())
                        .password(admin.getPassword())
                        .build()
                ).orElseThrow(() -> new UsernameNotFoundException("Admin not found with id: " + id));
    }
}
