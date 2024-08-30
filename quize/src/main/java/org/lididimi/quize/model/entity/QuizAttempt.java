package org.lididimi.quize.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="quiz_attempts")
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User student;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer score;

    public Optional<Quiz> getQuizOptional() {
        return Optional.ofNullable(quiz);
    }

    public Optional<Long> getQuizIdOptional() {
        return getQuizOptional().map(Quiz::getId);
    }
}
