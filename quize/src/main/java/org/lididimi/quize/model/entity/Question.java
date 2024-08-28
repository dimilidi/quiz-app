package org.lididimi.quize.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.lididimi.quize.model.dto.quiz.QuizDTO;
import org.lididimi.quize.model.enums.QuestionTypeEnum;

import java.util.ArrayList;
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
    private List<String> choices = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> correctAnswers = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "question_quiz",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "quiz_id")
    )
    private List<Quiz> quizzes = new ArrayList<>();

    public void addQuiz(Quiz quiz) {
        if (quizzes == null) {
            quizzes = new ArrayList<>();
        }
        quizzes.add(quiz);
    }
}