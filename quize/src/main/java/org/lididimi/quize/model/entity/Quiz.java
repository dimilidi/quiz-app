package org.lididimi.quize.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "qizzes")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @ManyToOne
    private Subject subject;

    @Column(nullable = false)
    private String instructions;

    private Integer timeLimit;

    @Column(nullable = false)
    private LocalDateTime start;

    @Column(nullable = false)
    private LocalDateTime end;

    @ManyToOne()
    private User createdBy;

/*    @ManyToMany()
    private List<User> tookBy;*/

    @ManyToMany()
    private List<Question> questions;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdDate;
}
