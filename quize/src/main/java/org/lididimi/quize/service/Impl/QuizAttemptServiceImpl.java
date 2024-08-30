package org.lididimi.quize.service.Impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.lididimi.quize.constants.QuizConstants;
import org.lididimi.quize.exception.common.ObjectNotFoundException;
import org.lididimi.quize.model.dto.quizAttempt.QuizAttemptDTO;
import org.lididimi.quize.model.dto.quizAttempt.QuizAttemptViewDTO;
import org.lididimi.quize.model.entity.Quiz;
import org.lididimi.quize.model.entity.QuizAttempt;
import org.lididimi.quize.model.entity.User;
import org.lididimi.quize.repository.QuizAttemptRepository;
import org.lididimi.quize.repository.QuizRepository;
import org.lididimi.quize.repository.UserRepository;
import org.lididimi.quize.service.QuizAttemptService;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizAttemptServiceImpl implements QuizAttemptService {

    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_INSTANT;

    @Override
    @Transactional
    public QuizAttemptDTO add(QuizAttemptDTO quizAttemptDTO) {
        // Fetch quiz and user entities from the database
        Quiz quiz = quizRepository.findById(quizAttemptDTO.getQuizId())
                .orElseThrow(() -> new ObjectNotFoundException(QuizConstants.QUIZ_NOT_FOUNT));
        User student = userRepository.findById(quizAttemptDTO.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException(QuizConstants.USER_NOT_FOUND));

        // Convert strings to LocalDateTime
        LocalDateTime startTime = Instant.parse(quizAttemptDTO.getStartTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
        LocalDateTime endTime = Instant.parse(quizAttemptDTO.getEndTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        // Create a new QuizAttempt entity
        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.setQuiz(quiz);
        quizAttempt.setStudent(student);
        quizAttempt.setStartTime(startTime);
        quizAttempt.setEndTime(endTime);
        quizAttempt.setScore(quizAttemptDTO.getScore());

        // Save the attempt
        QuizAttempt savedAttempt = quizAttemptRepository.save(quizAttempt);

        // Convert to DTO and return
        return convertToDTO(savedAttempt);
    }

    @Override
    public Optional<QuizAttemptDTO> getById(Long id) {
        Optional<QuizAttempt> quizAttempt = quizAttemptRepository.findById(id);
        return quizAttempt.map(this::convertToDTO);
    }

    @Override
    @Transactional
    public Page<QuizAttemptViewDTO> getByUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("endTime")));
        Page<QuizAttempt> quizAttemptsPage = quizAttemptRepository.findByStudentId(userId, pageable);

        List<QuizAttemptViewDTO> quizAttemptDTOs = quizAttemptsPage.stream()
                .map(this::convertToViewDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(quizAttemptDTOs, pageable, quizAttemptsPage.getTotalElements());
    }

    @Override
    @Transactional
    public Page<QuizAttemptViewDTO> getBestQuizAttempts(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<QuizAttempt> attempts = quizAttemptRepository.findByStudentId(userId, pageable);

        // Create a map to store the best attempt for each quiz
        Map<Long, QuizAttempt> bestAttemptsMap = new HashMap<>();

        for (QuizAttempt attempt : attempts) {
            Long quizId = attempt.getQuiz().getId();
            if (!bestAttemptsMap.containsKey(quizId)) {
                bestAttemptsMap.put(quizId, attempt);
            } else {
                QuizAttempt existingAttempt = bestAttemptsMap.get(quizId);
                // Compare scores first
                if (attempt.getScore() != null && existingAttempt.getScore() != null) {
                    if (attempt.getScore().equals(existingAttempt.getScore())) {
                        // If scores are the same, choose the most recent attempt
                        if (attempt.getStartTime().isAfter(existingAttempt.getStartTime())) {
                            bestAttemptsMap.put(quizId, attempt);
                        }
                    } else if (attempt.getScore() > existingAttempt.getScore()) {
                        bestAttemptsMap.put(quizId, attempt);
                    }
                }
            }
        }

        List<QuizAttempt> bestAttempts = new ArrayList<>(bestAttemptsMap.values());

        List<QuizAttemptViewDTO> bestAttemptsDTOs = bestAttempts.stream()
                .map(this::convertToViewDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(bestAttemptsDTOs, pageable, bestAttempts.size());
    }



    // Utility method to convert entity to DTO
    private QuizAttemptDTO convertToDTO(QuizAttempt quizAttempt) {
        QuizAttemptDTO dto = new QuizAttemptDTO();
        dto.setQuizId(quizAttempt.getQuiz().getId());
        dto.setStudentId(quizAttempt.getStudent().getId());
        dto.setStartTime(quizAttempt.getStartTime().toString());
        dto.setEndTime(quizAttempt.getEndTime().toString());
        dto.setScore(quizAttempt.getScore());
        return dto;
    }

    private QuizAttemptViewDTO convertToViewDTO(QuizAttempt quizAttempt) {
        QuizAttemptViewDTO dto = new QuizAttemptViewDTO();
        dto.setStudentId(quizAttempt.getStudent().getId());
        dto.setStartTime(quizAttempt.getStartTime().toString());
        dto.setEndTime(quizAttempt.getEndTime().toString());
        dto.setScore(quizAttempt.getScore());
        dto.setQuizName(quizAttempt.getQuiz().getTitle());
        dto.setQuestionsCount(quizAttempt.getQuiz().getQuestions().size());
        dto.setQuizSubject(quizAttempt.getQuiz().getSubject().getName());
        dto.setTimeLimit(quizAttempt.getQuiz().getTimeLimit());
        dto.setQuizId(quizAttempt.getQuiz().getId());
        return dto;
    }
}
