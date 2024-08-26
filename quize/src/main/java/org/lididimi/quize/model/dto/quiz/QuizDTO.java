package org.lididimi.quize.model.dto.quiz;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.lididimi.quize.model.entity.Question;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class QuizDTO {

    private Long id;

    @NotNull(message = "Quiz title is required.")
    @NotBlank(message = "Quiz title should not be empty.")
    private String title;

    private String subject;

    private Integer numberOfQuestions;

    private List<Question> questions = new ArrayList<>();
}
