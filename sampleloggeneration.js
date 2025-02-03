// In RestClientUtility class
private static final Logger PRIMARY_ROLE_LOGGER = Logger.getLogger("PrimaryRoleApiLogger");
private static final Logger SENSITIVITY_LOGGER = Logger.getLogger("SensitivityApiLogger");

// Replace existing log calls
PRIMARY_ROLE_LOGGER.info("Successfully Data received from Maestro API for Primary Role");
SENSITIVITY_LOGGER.info("Successfully Data received from Maestro API for Sensitivity");

// In DbeMaestroStartup class
PRIMARY_ROLE_LOGGER.info("Calling the sendPrimaryroleApi method");
SENSITIVITY_LOGGER.info("Calling the sensitivityResponse method");
