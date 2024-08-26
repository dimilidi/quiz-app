package org.lididimi.quize.model.dto.question;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuestionDTO {

    private Long id;


    private String title;

 @NotNull(message = "Question subject is required")
    @NotBlank(message = "Question subject should not be empty")
    private String subject;

    private String type;

    private List<String> choices;

    private List<String> correctAnswers;

}

