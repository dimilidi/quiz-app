package org.lididimi.quize.service;

import org.lididimi.quize.model.dto.question.QuestionDTO;
import org.lididimi.quize.model.dto.quiz.QuizDTO;

import java.util.List;

public interface QuizService {
    QuizDTO createQuiz(String subject, Integer numOfQuestions, String title);

    List<QuestionDTO> getQuizQuestions(Long id);
}
