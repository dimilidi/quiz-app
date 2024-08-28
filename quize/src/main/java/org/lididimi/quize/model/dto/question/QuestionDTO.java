package org.lididimi.quize.model.dto.question;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.lididimi.quize.model.enums.QuestionTypeEnum;

import java.util.ArrayList;
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

    private List<Long> quizIds = new ArrayList<>();

    private List<String> choices = new ArrayList<>();

    private List<String> correctAnswers = new ArrayList<>();

}

