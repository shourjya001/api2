package com.socgen.dbe;

import org.apache.log4j.Logger;
import org.apache.log4j.FileAppender;
import org.apache.log4j.PatternLayout;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CustomMultiApiAppender extends FileAppender {
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");
    private String apiName = "default";
    private String baseLogPath = "../maestro_lib/logs";

    public void setApiName(String apiName) {
        this.apiName = apiName;
    }
    
    public void setBaseLogPath(String baseLogPath) {
        this.baseLogPath = baseLogPath;
    }
    
    @Override
    public void activateOptions() {
        try {
            String date = DATE_FORMAT.format(new Date());
            
            // Ensure base and API-specific directories exist
            File baseDir = new File(baseLogPath);
            if (!baseDir.exists()) baseDir.mkdirs();
            
            File apiDir = new File(baseDir, apiName);
            if (!apiDir.exists()) apiDir.mkdirs();
            
            // Create log file path
            String logFileName = baseLogPath + File.separator + 
                                apiName + File.separator + 
                                "maestro_" + apiName + "_" + date + ".log";
            
            // Configure file appender
            setFile(logFileName);
            setLayout(new PatternLayout("%d{yyyy-MM-dd HH:mm:ss} [%t] %-5p %c{1}:%L - %m%n"));
            setAppend(true);
            
            super.activateOptions();
        } catch (IOException e) {
            System.err.println("Error configuring log file: " + e.getMessage());
        }
    }
}
