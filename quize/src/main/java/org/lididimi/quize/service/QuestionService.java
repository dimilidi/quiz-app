package org.lididimi.quize.service;

import org.lididimi.quize.model.dto.question.QuestionDTO;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface QuestionService {
    QuestionDTO createQuestion(QuestionDTO question);

    Page<QuestionDTO> getAllQuestions(int page, int size, String search);

    List<QuestionDTO> getQuestionsByQuiz(Long quizId);

    Optional<QuestionDTO> getQuestionById(Long id);

    QuestionDTO updateQuestion(Long id, QuestionDTO question) throws ChangeSetPersister.NotFoundException;

    void  deleteQuestion(Long id);

    List<QuestionDTO> getQuestionsForUser(Integer numOfQuestions, String subject);

}
