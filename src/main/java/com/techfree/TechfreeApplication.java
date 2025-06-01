package com.techfree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TechfreeApplication {

	public static void main(String[] args) {
		SpringApplication.run(TechfreeApplication.class, args);
	}

}
