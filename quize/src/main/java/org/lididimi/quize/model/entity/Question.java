package org.lididimi.quize.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.lididimi.quize.model.enums.QuestionTypeEnum;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(optional = false)
    private Subject subject;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private QuestionTypeEnum type;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> choices;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> correctAnswers;

    @ManyToMany()
    private List<Quiz> quizzes;
}