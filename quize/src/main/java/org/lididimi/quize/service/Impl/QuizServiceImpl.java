package org.lididimi.quize.service.Impl;

import jakarta.transaction.Transactional;
import org.lididimi.quize.constants.QuizConstants;
import org.lididimi.quize.exception.common.ObjectNotFoundException;
import org.lididimi.quize.model.dto.question.QuestionDTO;
import org.lididimi.quize.model.dto.quiz.QuizDTO;
import org.lididimi.quize.model.dto.quiz.QuizViewDTO;
import org.lididimi.quize.model.entity.Question;
import org.lididimi.quize.model.entity.Quiz;
import org.lididimi.quize.model.entity.Subject;
import org.lididimi.quize.model.entity.User;
import org.lididimi.quize.repository.QuestionRepository;
import org.lididimi.quize.repository.QuizRepository;
import org.lididimi.quize.repository.SubjectRepository;
import org.lididimi.quize.repository.UserRepository;
import org.lididimi.quize.security.filter.JwtFilter;
import org.lididimi.quize.service.QuizService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final ModelMapper modelMapper;
    private final JwtFilter jwtFilter;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;


    public QuizServiceImpl(
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            ModelMapper modelMapper,
            JwtFilter jwtFilter,
            UserRepository userRepository,
            SubjectRepository subjectRepository
            ) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.modelMapper = modelMapper;
        this.jwtFilter = jwtFilter;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
    }

    @Override
    public QuizDTO createQuiz(String subject, Integer numberOfQuestions, String title) {
        List<Question> questions = questionRepository.findRandomQuestionsBySubject(subject, numberOfQuestions);

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

    @Override
    @Transactional
    public QuizViewDTO getQuizById(Long id) {
        QuizViewDTO quizViewDTO = quizRepository.findById(id).map(this::convertToDTO).orElseThrow(NoSuchElementException::new);
        return quizViewDTO;
    }

    @Override
    @Transactional
    public List<QuizViewDTO> getQuizzesBySubject(String subjectName) {
        Optional<Subject> subjectOptional = subjectRepository.findByName(subjectName);
        if (subjectOptional.isPresent()) {
            List<Quiz> quizzes = quizRepository.findBySubject(subjectOptional.get());
            return quizzes.stream().map(this::convertToDTO).collect(Collectors.toList());
        } else {
            throw new ObjectNotFoundException(QuizConstants.SUBJECT_NOT_FOUND);
        }
    }



    @Override
    public QuizDTO addQuiz(QuizDTO quizDTO) {
        User user = userRepository.findByEmail(jwtFilter.currentUser())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Quiz quiz = convertToEntity(quizDTO);
        quiz.setCreatedBy(user);
        quiz.setUpdatedDate(ZonedDateTime.now().toInstant());

        Optional<Subject> subject = subjectRepository.findByName(quizDTO.getSubject());
        if (subject.isEmpty()) {
            Subject newSubject = new Subject();
            newSubject.setName(quizDTO.getSubject());
            subjectRepository.save(newSubject);
            quiz.setSubject(newSubject);
        } else {
            quiz.setSubject(subject.get());
        }

        Quiz newQuiz = quizRepository.save(quiz);
        return modelMapper.map(newQuiz, QuizDTO.class);
    }

    @Override
    public Page<QuizViewDTO> getAllQuizzes(int page, int size, String search) {


        // Create a Pageable object
        Pageable pageable = PageRequest.of(page, size);

        // Fetch quizzes with pagination
        Page<Quiz> quizPage;
        if (search != null && !search.isEmpty()) {
            quizPage = quizRepository.findByTitleContainingIgnoreCase(search, pageable);
        } else {
            quizPage = quizRepository.findAll(pageable);
        }

        // Convert the Page<Quiz> to Page<QuizDTO>
        Page<QuizViewDTO> quizDTOPage = quizPage.map(this::convertToDTO);

        return quizDTOPage;

    }


    @Override
    @Transactional
    public Page<QuizViewDTO> getQuizzesWithQuestions(int page, int size, String search) {
        // Create a Pageable object
        Pageable pageable = PageRequest.of(page, size);

        // Fetch quizzes with pagination
        Page<Quiz> quizPage;
        if (search != null && !search.isEmpty()) {
            quizPage = quizRepository.findByTitleContainingIgnoreCase(search, pageable);
        } else {
            quizPage = quizRepository.findAll(pageable);
        }

        // Filter quizzes with questions > 0
        List<Quiz> filteredQuizzes = quizPage.getContent().stream()
                .filter(quiz -> !quiz.getQuestions().isEmpty())
                .collect(Collectors.toList());

        // Convert the filtered quizzes to Page<QuizDTO>
        Page<QuizViewDTO> quizDTOPage = new PageImpl<>(filteredQuizzes.stream().map(this::convertToDTO).collect(Collectors.toList()), pageable, filteredQuizzes.size());

        return quizDTOPage;
    }

    @Override
    public QuizDTO updateQuiz(Long id, QuizDTO quizDTO)  {

        Quiz quiz = quizRepository.findById(id).orElseThrow(NoSuchElementException::new);

        quiz.setTitle(quizDTO.getTitle());
        quiz.setInstructions(quizDTO.getInstructions());
        quiz.setTimeLimit(quizDTO.getTimeLimit());
        quiz.setUpdatedDate(ZonedDateTime.now(ZoneId.systemDefault()).toInstant());
        Optional<Subject> subject = subjectRepository.findByName(quizDTO.getSubject());
        if (subject.isEmpty()) {
            Subject newSubject = new Subject();
            newSubject.setName(quizDTO.getSubject());
            subjectRepository.save(newSubject);
            quiz.setSubject(newSubject);
        } else {
            quiz.setSubject(subject.get());
        }

        Quiz savedQuiz = quizRepository.save(quiz);
        modelMapper.map(savedQuiz, quizDTO);
        return quizDTO;

    }

    @Override
    @Transactional
    public void deleteQuiz(Long id) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(NoSuchElementException::new);

        // Remove the quiz from the associated questions
        for (Question question : quiz.getQuestions()) {
            question.getQuizzes().remove(quiz);
            questionRepository.save(question);
        }

        quizRepository.deleteById(id);
    }



    private QuizViewDTO convertToDTO(Quiz quiz) {
        User user = userRepository.findByEmail(jwtFilter.currentUser())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        QuizViewDTO dto = new QuizViewDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setQuestionsCount(quiz.getQuestions().size());
        dto.setSubject(quiz.getSubject().getName());
        dto.setTimeLimit(quiz.getTimeLimit());
        dto.setCreatedBy(quiz.getCreatedBy().getName());
        dto.setInstructions(quiz.getInstructions());

        LocalDateTime updatedAt = quiz.getUpdatedDate().atZone(ZoneId.systemDefault()).toLocalDateTime();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        dto.setUpdatedAt(updatedAt.format(formatter));
        dto.setQuestionsCount(quiz.getQuestions().size());

        return dto;
    }

    private Quiz convertToEntity(QuizDTO quizDTO) {
        return modelMapper.map(quizDTO, Quiz.class);
    }

}
