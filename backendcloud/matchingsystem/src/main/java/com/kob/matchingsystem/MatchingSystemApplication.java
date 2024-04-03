package com.kob.matchingsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.kob.matchingsystem.service.impl.MathcingServiceImpl;

@SpringBootApplication
public class MatchingSystemApplication {
    public static void main(String[] args) {
        MathcingServiceImpl.matchingPool.start();
        SpringApplication.run(MatchingSystemApplication.class, args);
    }
}
