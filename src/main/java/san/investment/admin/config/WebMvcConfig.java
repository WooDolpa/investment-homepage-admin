package san.investment.admin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * packageName : san.investment.admin.config
 * className : WebMvcConfig
 * user : jwlee
 * date : 2025. 12. 26.
 * description : Web MVC Configuration for static resource handling
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.save.url}")
    private String fileSaveUrl;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files at /uploads/** URL pattern
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + fileSaveUrl + "/");
    }
}
