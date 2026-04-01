package com.sang.portfoliomanager;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class PortfolioManagerApplication {

    public static void main(String[] args) {SpringApplication.run(PortfolioManagerApplication.class, args);
    }

    @Bean
    public OpenAPI portfolioOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Portfolio Manager API")
                        .description("Core REST API documentation for the enterprise-grade Portfolio Management System.")
                        .version("v1.0.0"));
    }

}
