package org.lididimi.quize.model.dto.quizAttempt;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizAttemptDTO {
    private Long quizId;

    private Long studentId;

    private String startTime;

    private String endTime;

    private Integer score;
}
