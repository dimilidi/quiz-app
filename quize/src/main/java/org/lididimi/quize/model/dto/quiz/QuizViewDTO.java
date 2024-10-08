package org.lididimi.quize.model.dto.quiz;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class QuizViewDTO {
    private Long id;

    private String title;

    private String subject;

    private String instructions;

    private Integer timeLimit;

    private String createdBy;

    private String updatedAt;

    private int questionsCount = 0;
}
