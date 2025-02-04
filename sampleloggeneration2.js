// DbeMaestroStartup.java
import org.apache.log4j.Logger;
import org.apache.log4j.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class DbeMaestroStartup {
    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    static DbeClientDao clientDao;

    // Change to use specific loggers for each API
    private static final Logger primaryRoleLogger = Logger.getLogger("PrimaryRoleApiLogger");
    private static final Logger sensitivityLogger = Logger.getLogger("SensitivityApiLogger");
    private static final Logger mainLogger = Logger.getLogger(DbeMaestroStartup.class);

    public static void main(String[] args) throws SQLException, ParseException {
        try {
            AnnotationConfigApplicationContext annotationConfigApplicationContext = 
                new AnnotationConfigApplicationContext(new Class[]{ApplicationConfig.class});

            DbeClientService dbeClientService = (DbeClientService) annotationConfigApplicationContext
                .getBean("dbeClientService");
            RestClientUtility restClientUtility = (RestClientUtility) annotationConfigApplicationContext
                .getBean("restClientUtility");
            
            ObjectMapper mapperObj = new ObjectMapper();

            try {
                Response PrimaryroleApiResponse = null;
                PrimaryroleApiResponse = restClientUtility.sendPrimaryroleApi();

                if (PrimaryroleApiResponse != null) {
                    primaryRoleLogger.info("Calling the sendPrimaryroleApi method");
                    dbeClientService.savePrimaryroleApi(PrimaryroleApiResponse);
                    
                    primaryRoleLogger.info("Started getStoredProcedurePrimayrole");
                    dbeClientService.getStoredProcedurePrimayrole();
                    primaryRoleLogger.info("Finished getStoredProcedurePrimayrole");

                    if (PrimaryroleApiResponse.getRelationships().size() > 0) {
                        try {
                            ResponseSensitivity sensitivityResponse = restClientUtility.sendInternalRatingsApi();
                            
                            if (sensitivityResponse != null) {
                                sensitivityLogger.info("Calling the sensitivityResponse method");
                                dbeClientService.saveSensitivityApi(sensitivityResponse);
                            }
                        } catch (Exception e) {
                            sensitivityLogger.error("Error in sensitivity API processing: " + e.getMessage(), e);
                        }
                    }
                }

                mainLogger.info("Started getStoredProcedureActioncode");
                dbeClientService.getStoredProcedureActioncode();
                mainLogger.info("Finished getStoredProcedureActioncode");

            } catch (Exception e) {
                mainLogger.error("Error in main processing: " + e.getMessage(), e);
            } finally {
                // Clean up loggers
                closeLoggers();
            }
        } finally {
            // Ensure loggers are closed even if context creation fails
            closeLoggers();
        }
    }

    private static void closeLoggers() {
        try {
            // Close Primary Role logger
            CustomMultiApiAppender primaryRoleAppender = 
                (CustomMultiApiAppender) primaryRoleLogger.getAppender("PrimaryRoleFile");
            if (primaryRoleAppender != null) {
                primaryRoleAppender.forceFlush();
                primaryRoleAppender.closeLogFile();
            }

            // Close Sensitivity logger
            CustomMultiApiAppender sensitivityAppender = 
                (CustomMultiApiAppender) sensitivityLogger.getAppender("SensitivityFile");
            if (sensitivityAppender != null) {
                sensitivityAppender.forceFlush();
                sensitivityAppender.closeLogFile();
            }
        } catch (Exception e) {
            System.err.println("Error closing loggers: " + e.getMessage());
        }
    }
}

// RestClientUtility.java - Updated logging section
public class RestClientUtility {
    // Update to use specific loggers
    private static final Logger primaryRoleLogger = Logger.getLogger("PrimaryRoleApiLogger");
    private static final Logger sensitivityLogger = Logger.getLogger("SensitivityApiLogger");

    private String decompressData(byte[] compressedBytes) {
        try {
            ByteArrayInputStream bis = new ByteArrayInputStream(compressedBytes);
            GZIPInputStream gis = new GZIPInputStream(bis);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            byte[] buffer = new byte[1098];
            int len;
            
            while ((len = gis.read(buffer)) != -1) {
                bos.write(buffer, 0, len);
            }
            
            gis.close();
            bos.close();
            return new String(bos.toByteArray(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            primaryRoleLogger.error("GZIP decompression failed, trying Inflater: " + e.getMessage());
            
            try {
                Inflater inflater = new Inflater(true);
                inflater.setInput(compressedBytes);
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream(compressedBytes.length);
                byte[] buffer = new byte[9098];
                
                while (!inflater.finished()) {
                    int count = inflater.inflate(buffer);
                    outputStream.write(buffer, 0, count);
                }
                
                outputStream.close();
                inflater.end();
                return new String(outputStream.toByteArray(), StandardCharsets.UTF_8);
            } catch (DataFormatException | IOException ex) {
                primaryRoleLogger.error("Error decompressing content with Inflater: " + ex.getMessage(), ex);
            }
            
            primaryRoleLogger.error("Both decompression methods failed. Returning original data as string.");
            return new String(compressedBytes, StandardCharsets.UTF_8);
        }
    }
}
