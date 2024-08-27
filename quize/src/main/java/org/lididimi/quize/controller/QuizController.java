package org.lididimi.quize.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.lididimi.quize.model.dto.question.QuestionDTO;
import org.lididimi.quize.model.dto.quiz.QuizDTO;
import org.lididimi.quize.model.dto.quiz.QuizViewDTO;
import org.lididimi.quize.service.QuizService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

/*
    @PostMapping("/question/add")
    public ResponseEntity<QuizDTO> createQuestion(@Valid @RequestBody QuizDTO quiz) {
        QuizDTO addedQuiz = quizService.addQuiz(quiz);
        return ResponseEntity.status(CREATED).body(quiz);
    }*/


    @GetMapping("/get")
    @Transactional
    public ResponseEntity<Page<QuizViewDTO>> getAllQuizzes(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "search", defaultValue = "") String search) {

        Page<QuizViewDTO> quizzes = quizService.getAllQuizzes(page, size, search);
        return ResponseEntity.ok(quizzes);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createQuiz(@RequestBody @Valid QuizDTO quizDTO) {
        quizService.createQuiz(quizDTO.getSubject(), quizDTO.getNumberOfQuestions(), quizDTO.getTitle());
        return ResponseEntity.status(CREATED).body("Successfully created quiz");
    }

    @PostMapping("/add")
    public ResponseEntity<?> addQuiz(@RequestBody @Valid QuizDTO quizDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        quizService.addQuiz(quizDTO);
        return ResponseEntity.status(CREATED).body("Successfully created quiz");
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<List<QuestionDTO>> getQuizQuestions(@PathVariable("id") Long id) {
        List<QuestionDTO> quizQuestions = quizService.getQuizQuestions(id);
        return ResponseEntity.ok(quizQuestions);
    }



}
