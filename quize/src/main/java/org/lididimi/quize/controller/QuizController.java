package org.lididimi.quize.controller;

import jakarta.validation.Valid;
import org.lididimi.quize.model.dto.question.QuestionDTO;
import org.lididimi.quize.model.dto.quiz.QuizDTO;
import org.lididimi.quize.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createQuiz(@RequestBody @Valid QuizDTO quizDTO) {
        quizService.createQuiz(quizDTO.getSubject(), quizDTO.getNumberOfQuestions(), quizDTO.getTitle());
        return ResponseEntity.status(CREATED).body("Successfully created quiz");
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<List<QuestionDTO>> getQuizQuestions(@PathVariable("id") Long id) {
        List<QuestionDTO> quizQuestions = quizService.getQuizQuestions(id);
        return ResponseEntity.ok(quizQuestions);
    }



}
