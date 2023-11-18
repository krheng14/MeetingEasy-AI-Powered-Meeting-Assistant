import pydantic

class Settings(pydantic.BaseSettings):
    """
    Configuration class for application settings

    Attributes:
        API_NAME (str): The name of the API. Default is "project_simulation_fastapi".
        LOGGER_CONFIG_PATH (str): The file path to the logging configuration file. Default is "../conf/base/logging.yml".
    """

    API_NAME: str = "MeetingEasy_fastapi"
    LOGGER_CONFIG_PATH: str = "../conf/base/logging.yml"


SETTINGS = Settings()
