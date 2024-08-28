package org.lididimi.quize.service.Impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.lididimi.quize.model.dto.question.QuestionDTO;
import org.lididimi.quize.model.entity.Question;
import org.lididimi.quize.model.entity.Quiz;
import org.lididimi.quize.model.entity.Subject;
import org.lididimi.quize.model.enums.QuestionTypeEnum;
import org.lididimi.quize.repository.QuestionRepository;
import org.lididimi.quize.repository.QuizRepository;
import org.lididimi.quize.repository.RoleRepository;
import org.lididimi.quize.repository.SubjectRepository;
import org.lididimi.quize.service.QuestionService;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final  QuizRepository quizRepository;

    public QuestionDTO createQuestion(QuestionDTO questionDTO) {
        Question question = convertToEntity(questionDTO);

        // Fetch quizzes and associate them with the question
        List<Quiz> quizzes = quizRepository.findAllById(questionDTO.getQuizIds());
        question.setQuizzes(quizzes);

        Question createdQuestion = questionRepository.save(question);
        return convertToDTO(createdQuestion);
    }

    @Transactional
    @Override
    public List<QuestionDTO> getAllQuestions() {
        return questionRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Optional<QuestionDTO> getQuestionById(Long id) {
        return questionRepository.findById(id).map(this::convertToDTO);
    }


    @Override
    public QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO) throws ChangeSetPersister.NotFoundException {
        Optional<Question> questionById = questionRepository.findById(id);
        if (questionById.isPresent()) {
            Question updatedQuestion = questionById.get();
            updatedQuestion.setTitle(questionDTO.getTitle());
            updatedQuestion.setChoices(questionDTO.getChoices());
            updatedQuestion.setCorrectAnswers(questionDTO.getCorrectAnswers());
            Question savedQuestion = questionRepository.save(updatedQuestion);
            return convertToDTO(savedQuestion);
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @Override
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    @Override
    public List<QuestionDTO> getQuestionsForUser(Integer numOfQuestions, String subject) {
        Pageable pageable = PageRequest.of(0, numOfQuestions);
        return questionRepository.findBySubject(subject, pageable)
                .getContent()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // Utility method to convert Question entity to DTO
    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setSubject(question.getSubject().getName());
        dto.setType(question.getType().name());
        dto.setChoices(question.getChoices());
        dto.setCorrectAnswers(question.getCorrectAnswers());
        dto.setQuizIds(question.getQuizzes().stream().map(Quiz::getId).collect(Collectors.toList()));
        return dto;
    }

    // Utility method to convert DTO to Question entity
    private Question convertToEntity(QuestionDTO dto) {
        Question question = new Question();

        question.setTitle(dto.getTitle());

        Optional<Subject> subjectOptional = subjectRepository.findByName(dto.getSubject());
        if (subjectOptional.isEmpty()) {
            Subject newSubject = new Subject();
            newSubject.setName(dto.getSubject());
            subjectRepository.save(newSubject);
            question.setSubject(newSubject);
        } else {
            question.setSubject(subjectOptional.get());
        }

        QuestionTypeEnum questionTypeEnum = QuestionTypeEnum.SINGLE.name().equals(dto.getType()) ? QuestionTypeEnum.SINGLE : QuestionTypeEnum.MULTIPLE;

        question.setType(questionTypeEnum);
        question.setChoices(dto.getChoices());
        question.setCorrectAnswers(dto.getCorrectAnswers());

        return question;
    }
}
