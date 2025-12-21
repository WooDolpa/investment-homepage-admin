package san.investment.admin.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * packageName : san.investment.admin.utils
 * className : PageableUtil
 * user : jwlee
 * date : 2025. 12. 22.
 * description :
 */
public class PageableUtil {

    /**
     * Pageable 객체 만들기
     *
     * @param sort
     * @param directionString
     * @param page
     * @param size
     * @return
     */
    public static Pageable createPageable(String sort, String directionString, int page, int size) {
        Sort.Direction direction = Sort.Direction.fromString(directionString);
        return PageRequest.of(page, size, Sort.by(direction, sort));
    }
}
