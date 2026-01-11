package san.investment.admin.utils;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import san.investment.admin.dto.portfolio.PortfolioNewsCrawlingResDto;
import san.investment.common.exception.CustomException;
import san.investment.common.exception.ExceptionCode;

import java.io.IOException;

/**
 * packageName : san.investment.admin.utils
 * className : WebCrollingUtil
 * user : jwlee
 * date : 2026. 1. 10.
 * description :
 */
@Slf4j
@Component
public class WebCrawlingUtil {

    /**
     * 뉴스기사 크롤링
     *
     * @param targetUrl
     * @return
     */
    public PortfolioNewsCrawlingResDto findNewsInfo(String targetUrl) {

        try {

            String title = "";
            String agency = "";
            String link = "";

            Document doc = Jsoup.connect(targetUrl)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(5000)
                    .get();

            Elements metaTags = doc.select("meta");

            for (Element meta : metaTags) {
                String key = "";
                String value = meta.attr("content");

                if(meta.hasAttr("name")) {
                    key = meta.attr("name");
                } else if(meta.hasAttr("property")) {
                    key = meta.attr("property");
                }

                if("og:title".equals(key)) {
                    title = value;
                }else if("og:site_name".equals(key)) {
                    agency = value;
                }else if("og:url".equals(key)) {
                    link = value;
                }
            }

            if(!StringUtils.hasText(link)) {
                link = targetUrl;
            }

            return PortfolioNewsCrawlingResDto.builder()
                    .newsTitle(title)
                    .newsAgency(agency)
                    .newsLink(link)
                    .build();

        } catch (IOException e) {
            log.error("[WebCrawlingUtil][findNewsInfo] Jsoup Error : {}", e.getMessage());
            throw new CustomException(ExceptionCode.CRAWLING_REQUEST_ERROR);
        }
    }
}
