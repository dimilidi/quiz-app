package org.lididimi.quize.model.dto.quizAttempt;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizAttemptViewDTO {

    private Long studentId;

    private Long quizId;

    private String quizName;

    private String quizSubject;

    private int questionsCount = 0;

    private Integer timeLimit;

    private String startTime;

    private String endTime;

    private Integer score;
}
