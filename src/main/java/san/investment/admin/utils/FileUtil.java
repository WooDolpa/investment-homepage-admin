package san.investment.admin.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

/**
 * packageName : san.investment.admin.utils
 * className : FileUtil
 * user : jwlee
 * date : 2025. 12. 21.
 * description :
 */
@Slf4j
@Component
public class FileUtil {

    @Value("${file.save.url}")
    private String saveUrl;

    public String saveFile(MultipartFile file, String subDirectory) {

        String fileUrl = "";

        try {

            Path baseDirectory = Paths.get(saveUrl).resolve(subDirectory);
            if (Files.notExists(baseDirectory)) {
                Files.createDirectories(baseDirectory);
            }

            String fileName = file.getOriginalFilename();
            if(StringUtils.hasText(fileName)) {
                Path saveFilePath = baseDirectory.resolve(fileName);
                Files.copy(file.getInputStream(), saveFilePath, StandardCopyOption.REPLACE_EXISTING);

                // Return web-accessible URL path instead of absolute file system path
                fileUrl = "/uploads/" + subDirectory + "/" + fileName;
            }

        } catch (IOException e) {
            log.error("[FileUtil][saveFile] file save error : {}", e.getMessage());
        }

        return fileUrl;
    }
}
