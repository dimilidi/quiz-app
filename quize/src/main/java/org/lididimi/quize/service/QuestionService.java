package org.lididimi.quize.service;

import org.lididimi.quize.model.dto.question.QuestionDTO;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;
import java.util.Optional;

public interface QuestionService {
    QuestionDTO createQuestion(QuestionDTO question);

    List<QuestionDTO> getAllQuestions();

    Optional<QuestionDTO> getQuestionById(Long id);

    List<String> getAllSubjects();

    QuestionDTO updateQuestion(Long id, QuestionDTO question) throws ChangeSetPersister.NotFoundException;

    void  deleteQuestion(Long id);

    List<QuestionDTO> getQuestionsForUser(Integer numOfQuestions, String subject);

}
