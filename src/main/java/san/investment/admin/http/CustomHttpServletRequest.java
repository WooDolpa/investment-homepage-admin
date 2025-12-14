package san.investment.admin.http;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

public class CustomHttpServletRequest extends HttpServletRequestWrapper {

    private final Map<String, String> customHeaders;

    public CustomHttpServletRequest(HttpServletRequest request) {
        super(request);
        this.customHeaders = new HashMap<>();
    }

    public void putHeader(String name, String value) {
        this.customHeaders.put(name, value);
    }

    public String getHeader(String name) {
        String headerValue = this.customHeaders.get(name);
        if(StringUtils.hasText(headerValue)) {
            return headerValue;
        }
        return ((HttpServletRequest)getRequest()).getHeader(name);
    }
}
