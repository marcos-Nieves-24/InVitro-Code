from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    CLERK_JWKS_URL: str
    CLERK_ISSUER: str
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    ENVIRONMENT: str = "development"

    # Connection pool settings
    DB_POOL_MIN: int = 2
    DB_POOL_MAX: int = 10

    class Config:
        env_file = ".env"


settings = Settings()
