package org.lididimi.quize.service;

import org.lididimi.quize.model.dto.question.QuestionDTO;
import org.lididimi.quize.model.dto.quiz.QuizDTO;
import org.lididimi.quize.model.dto.quiz.QuizViewDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface QuizService {
    QuizDTO createQuiz(String subject, Integer numOfQuestions, String title);

    List<QuestionDTO> getQuizQuestions(Long id);

    QuizDTO addQuiz(QuizDTO quiz);

    Page<QuizViewDTO> getAllQuizzes(int page, int size, String search);

}
