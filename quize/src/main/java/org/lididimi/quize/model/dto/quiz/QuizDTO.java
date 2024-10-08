package org.lididimi.quize.model.dto.quiz;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizDTO {

    private Long id;

    @NotNull(message = "Quiz title is required.")
    @NotBlank(message = "Quiz title should not be empty.")
    private String title;

    private String subject;

    private int numberOfQuestions = 0;

    private String instructions;

    private Integer timeLimit;
}
