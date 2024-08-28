package org.lididimi.quize.model.dto.subject;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class SubjectWithQuizCountDTO {
    private String name;
    private long quizCount;

}
