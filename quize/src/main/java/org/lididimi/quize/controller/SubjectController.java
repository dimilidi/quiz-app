package org.lididimi.quize.controller;

import lombok.AllArgsConstructor;
import org.lididimi.quize.model.dto.subject.SubjectDTO;
import org.lididimi.quize.model.dto.subject.SubjectWithQuizCountDTO;
import org.lididimi.quize.model.entity.Subject;
import org.lididimi.quize.service.QuizService;
import org.lididimi.quize.service.SubjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/subjects")
public class SubjectController {

    private final SubjectService subjectService;


    @GetMapping("/get")
    public ResponseEntity<?> getAllSubjects() {
        List<SubjectDTO> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/with-quiz-counts")
    public ResponseEntity<List<SubjectWithQuizCountDTO>> getSubjectsWithQuizCounts() {
        List<SubjectWithQuizCountDTO> subjects = subjectService.getSubjectsWithQuizCounts();
        return ResponseEntity.ok(subjects);
    }

}
