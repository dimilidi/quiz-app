package org.lididimi.quize.model.dto.question;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.lididimi.quize.model.enums.QuestionTypeEnum;

import java.util.List;

@Getter
@Setter
public class QuestionDTO {

    private Long id;

    @NotNull(message = "Question title is required")
    @NotBlank(message = "Question title should not be empty")
    private String title;

    @NotNull(message = "Question subject is required")
    @NotBlank(message = "Question subject should not be empty")
    private String subject;

    private String type;

    private String quizTitle;

    private List<String> choices;

    private List<String> correctAnswers;

}

