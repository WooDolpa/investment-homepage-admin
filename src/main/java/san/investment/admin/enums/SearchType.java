package san.investment.admin.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum SearchType {

    MENU_NAME("menuName", "메뉴명")
    ;

    private final String key;
    private final String desc;

    public static SearchType findSearchType(String key) {
        return Arrays.stream(SearchType.values())
                .filter(i -> i.key.equals(key))
                .findFirst()
                .orElse(null);
    }
}
