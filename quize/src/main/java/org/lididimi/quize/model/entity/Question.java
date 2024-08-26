package org.lididimi.quize.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String type;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> choices;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> correctAnswers;
}