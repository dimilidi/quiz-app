package org.lididimi.quize.service.Impl;

import jakarta.transaction.Transactional;
import org.lididimi.quize.model.dto.question.QuestionDTO;
import org.lididimi.quize.model.dto.quiz.QuizDTO;
import org.lididimi.quize.model.entity.Question;
import org.lididimi.quize.model.entity.Quiz;
import org.lididimi.quize.repository.QuestionRepository;
import org.lididimi.quize.repository.QuizRepository;
import org.lididimi.quize.service.QuizService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final ModelMapper modelMapper;

    public QuizServiceImpl(QuizRepository quizRepository, QuestionRepository questionRepository, ModelMapper modelMapper) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public QuizDTO createQuiz(String subject, Integer numberOfQuestions, String title) {
        List<Question> questions =  questionRepository.findRandomQuestionsBySubject(subject, numberOfQuestions);

        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setQuestions(questions);

        quizRepository.save(quiz);

        QuizDTO map = modelMapper.map(quiz, QuizDTO.class);
        map.setSubject(subject);
        map.setNumberOfQuestions(numberOfQuestions);

        return map;
    }

    @Transactional
    @Override
    public List<QuestionDTO> getQuizQuestions(Long id) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(NoSuchElementException::new);

        List<Question> questionsFromDB = quiz.getQuestions();

        List<QuestionDTO> questionDTOs = new ArrayList<>();
        for (Question question : questionsFromDB) {
            QuestionDTO questionDTO = modelMapper.map(question, QuestionDTO.class);

            questionDTOs.add(questionDTO);
        }
        return questionDTOs;
    }

}
