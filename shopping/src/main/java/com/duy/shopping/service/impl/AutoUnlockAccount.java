package com.duy.shopping.service.impl;

import com.duy.shopping.repository.UserRepository;
import com.duy.shopping.model.User;
import org.springframework.stereotype.Service;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class AutoUnlockAccount {
    private final UserRepository userRepository;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public AutoUnlockAccount(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void scheduleUnlock(long userId, int timeLockAccount) {
        scheduler.schedule(() -> {
            User accused = userRepository.findById(userId);
            accused.setStatus(1);
            userRepository.save(accused);
        }, timeLockAccount, TimeUnit.DAYS);
    }
    public void scheduleLock(long userId) {
        scheduler.schedule(() -> {
            User accused = userRepository.findById(userId);
            accused.setStatus(0);
            userRepository.save(accused);
        }, 2, TimeUnit.HOURS);
    }
}
