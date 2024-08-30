package org.lididimi.quize.service;

import org.lididimi.quize.model.dto.quizAttempt.QuizAttemptDTO;
import org.lididimi.quize.model.dto.quizAttempt.QuizAttemptViewDTO;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface QuizAttemptService {

    QuizAttemptDTO add(QuizAttemptDTO quizAttemptDTO);

    Optional<QuizAttemptDTO> getById(Long id);

    Page<QuizAttemptViewDTO> getByUser(Long userId, int page, int size);

    Page<QuizAttemptViewDTO> getBestQuizAttempts(Long userId, int page, int size);
}
