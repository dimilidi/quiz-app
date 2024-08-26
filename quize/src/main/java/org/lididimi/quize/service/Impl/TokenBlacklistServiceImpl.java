package org.lididimi.quize.service.Impl;

import lombok.extern.slf4j.Slf4j;
import org.lididimi.quize.service.TokenBlackListService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class TokenBlacklistServiceImpl implements TokenBlackListService {
    private final List<String> blacklistedTokens = Collections.synchronizedList(new ArrayList<>());

    @Override
    public void addToBlacklist(String token) {
        log.info("Adding to blacklist: {}", token);

        blacklistedTokens.add(token);
    }

    @Override
    public boolean isBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }
}
