package com.socgen.dbe;

import org.apache.log4j.FileAppender;
import org.apache.log4j.helpers.LogLog;
import org.apache.log4j.spi.LoggingEvent;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CustomRealTimeAppender extends FileAppender {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private String lastFileName;
    private String apiName; // To identify which API's logs we're handling

    // Constructor to set API name
    public CustomRealTimeAppender(String apiName) {
        this.apiName = apiName;
    }

    // Setter for API name if needed after construction
    public void setApiName(String apiName) {
        this.apiName = apiName;
    }

    @Override
    public void activateOptions() {
        updateFileName();
        super.activateOptions();
    }

    private void updateFileName() {
        try {
            String date = dateFormat.format(new Date());
            
            // Create base logs directory
            File baseLogsDir = new File("maestro_lib/logs");
            if (!baseLogsDir.exists()) {
                baseLogsDir.mkdirs();
            }

            // Create API-specific directory
            File apiLogsDir = new File(baseLogsDir, apiName);
            if (!apiLogsDir.exists()) {
                apiLogsDir.mkdirs();
            }

            // Construct new file name with API-specific path
            String newFileName = "maestro_lib/logs/" + apiName + "/maestrologs_" + date + ".log";

            if (!newFileName.equals(lastFileName)) {
                lastFileName = newFileName;
                setFile(newFileName, true, bufferedIO, bufferSize);
            }
        } catch (IOException e) {
            LogLog.error("Error updating log file for API: " + apiName, e);
        }
    }

    @Override
    protected void subAppend(LoggingEvent event) {
        String currentDate = dateFormat.format(new Date());
        String expectedFileName = "maestro_lib/logs/" + apiName + "/maestrologs_" + currentDate + ".log";

        if (!expectedFileName.equals(lastFileName)) {
            updateFileName();
        }

        super.subAppend(event);
        
        if (qw != null) {
            qw.flush();
        }
    }
}
