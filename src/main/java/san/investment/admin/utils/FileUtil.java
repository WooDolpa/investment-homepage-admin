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

    /**
     * Save file to disk and return web-accessible path
     *
     * @param file file to save
     * @param subDirectory subdirectory under base save directory
     * @return web-accessible path (/uploads/...)
     */
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

    /**
     * Convert absolute file path to web-accessible path
     *
     * @param filePath absolute file path or web path
     * @return web-accessible path (/uploads/...) or null if input is null/empty
     */
    public String convertToWebPath(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return null;
        }

        // If already a web path, return as is
        if (filePath.startsWith("/uploads/")) {
            return filePath;
        }

        // Convert absolute file path to web path
        // Extract the relative path after the base save directory
        String normalizedPath = filePath.replace("\\", "/");
        String normalizedSaveUrl = Paths.get(saveUrl).toString().replace("\\", "/");

        int saveUrlIndex = normalizedPath.indexOf(normalizedSaveUrl);

        if (saveUrlIndex >= 0) {
            // Extract relative path after saveUrl
            String relativePath = normalizedPath.substring(saveUrlIndex + normalizedSaveUrl.length());
            // Remove leading slash if present
            if (relativePath.startsWith("/")) {
                relativePath = relativePath.substring(1);
            }
            return "/uploads/" + relativePath;
        }

        // If path format is unexpected, return original
        log.warn("[FileUtil][convertToWebPath] Unexpected file path format: {}", filePath);
        return filePath;
    }
}
