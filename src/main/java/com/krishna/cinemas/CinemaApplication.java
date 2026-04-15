package com.krishna.cinemas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
class CinemasApplication {

    public static void main(String[] args) {
        // This line launches the entire Spring Boot framework
        SpringApplication.run(CinemasApplication.class, args);

        System.out.println("--------------------------------------");
        System.out.println("  Krishna Cinemas Backend is Running! ");
        System.out.println("--------------------------------------");
    }
}