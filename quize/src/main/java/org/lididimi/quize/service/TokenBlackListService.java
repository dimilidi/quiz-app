package org.lididimi.quize.service;

public interface TokenBlackListService {

    void addToBlacklist(String token);

    boolean isBlacklisted(String token);

}
