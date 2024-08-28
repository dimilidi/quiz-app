package org.lididimi.quize.repository;

import org.lididimi.quize.model.entity.Quiz;
import org.lididimi.quize.model.entity.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Page<Quiz> findByTitleContainingIgnoreCase(String search, Pageable pageable);

    List<Quiz> findBySubject(Subject subject);
}
