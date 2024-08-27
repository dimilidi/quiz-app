package org.lididimi.quize.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.lididimi.quize.model.dto.question.QuestionDTO;
import org.lididimi.quize.model.entity.Question;
import org.lididimi.quize.service.QuestionService;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;


import static org.springframework.http.HttpStatus.CREATED;


@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @PostMapping("/create-new-question")
    public ResponseEntity<?> createQuestion(@Valid @RequestBody QuestionDTO question, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        QuestionDTO createdQuestion = questionService.createQuestion(question);
        return ResponseEntity.status(CREATED).body(question);
    }

    @GetMapping("/all-questions")
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        List<QuestionDTO> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/question/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long id) throws ChangeSetPersister.NotFoundException {
        Optional<QuestionDTO> questionById = questionService.getQuestionById(id);
        if (questionById.isPresent()) {
            return ResponseEntity.ok(questionById.get());
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @PutMapping("/question/{id}/update")
    public ResponseEntity<QuestionDTO> updateQuestion(
            @PathVariable Long id, @RequestBody QuestionDTO question) throws ChangeSetPersister.NotFoundException {
        QuestionDTO updatedQuestion = questionService.updateQuestion(id, question);
        return ResponseEntity.ok(question);
    }

    @DeleteMapping("/question/{id}/delete")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/quiz/fetch-questions-for-user")
    public ResponseEntity<List<QuestionDTO>> getQuestionsForUser(
            @RequestParam Integer numOfQuestions, @RequestParam String subject) {
        List<QuestionDTO> allQuestions = questionService.getQuestionsForUser(numOfQuestions, subject);

        List<QuestionDTO> mutableQuestions = new ArrayList<>(allQuestions);
        Collections.shuffle(mutableQuestions);

        int availableQuestions = Math.min(numOfQuestions, mutableQuestions.size());
        List<QuestionDTO> randomQuestions = mutableQuestions.subList(0, availableQuestions);
        return ResponseEntity.ok(randomQuestions);
    }

    // Utility method to convert Question entity to DTO
    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setSubject(question.getSubject().getName());
        dto.setType(question.getType().name());
        dto.setChoices(question.getChoices());

        return dto;
    }
}
