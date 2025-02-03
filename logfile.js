package com.socgen.dbe;

import org.apache.log4j.FileAppender;
import org.apache.log4j.helpers.LogLog;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CustomRealTimeAppender extends FileAppender {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HHmmss");
    private String lastFileName;
    private String apiName; // New field to store API name

    public CustomRealTimeAppender(String apiName) {
        this.apiName = apiName;
    }

    @Override
    public void activateOptions() {
        updateFileName();
        super.activateOptions();
    }

    private void updateFileName() {
        try {
            String currentDate = dateFormat.format(new Date());
            File logsDir = new File("Logs");
            if (!logsDir.exists()) {
                logsDir.mkdirs();
            }

            String newFileName = "Logs/maestrologs_" + apiName + "_" + currentDate + ".log";
            if (!newFileName.equals(lastFileName)) {
                setFile(newFileName, true, false, 0);
                lastFileName = newFileName;
            }
        } catch (IOException e) {
            LogLog.error("Error updating log file", e);
        }
    }

    @Override
    protected void subAppend(org.apache.log4j.spi.LoggingEvent event) {
        updateFileName();
        super.subAppend(event);
        if (qw != null) {
            qw.flush();
        }
    }
}
